import React, { useState, useRef, useEffect } from 'react';
import { AnnotationItem, Point, ReviewComment, ToolMode } from '../../types/annotation';
import { MessageSquare, Trash2 } from 'lucide-react';

interface AnnotationOverlayProps {
  activeTool: ToolMode;
  selectedColor: string;
  strokeWidth: number;
  annotations: AnnotationItem[];
  comments: ReviewComment[];
  onAddAnnotation: (anno: AnnotationItem) => void;
  onDeleteAnnotation: (id: string) => void;
  onOpenCommentPin: (x: number, y: number) => void;
  onSelectComment: (comment: ReviewComment) => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  activeTool,
  selectedColor,
  strokeWidth,
  annotations,
  comments,
  onAddAnnotation,
  onDeleteAnnotation,
  onOpenCommentPin,
  onSelectComment
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [currentShape, setCurrentShape] = useState<Partial<AnnotationItem> | null>(null);

  // Helper to get relative coordinates from pointer event
  const getRelativeCoords = (e: React.PointerEvent): Point => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'select') return;

    const pt = getRelativeCoords(e);

    if (activeTool === 'comment') {
      // Calculate percentage coordinates (0 - 100%)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const pctX = Math.round((pt.x / rect.width) * 100);
        const pctY = Math.round((pt.y / rect.height) * 100);
        onOpenCommentPin(pctX, pctY);
      }
      return;
    }

    if (activeTool === 'text') {
      const text = window.prompt('Masukkan teks catatan anotasi:');
      if (text && text.trim()) {
        const newAnno: AnnotationItem = {
          id: `anno-${Date.now()}`,
          projectId: 'PKS-994KY1',
          type: 'text',
          color: selectedColor,
          strokeWidth,
          x: pt.x,
          y: pt.y,
          text: text.trim(),
          createdAt: new Date().toISOString()
        };
        onAddAnnotation(newAnno);
      }
      return;
    }

    // Start drawing shape or path
    setIsDrawing(true);
    setStartPoint(pt);

    if (activeTool === 'pen' || activeTool === 'highlight') {
      setCurrentPoints([pt]);
    } else {
      setCurrentShape({
        type: activeTool as any,
        color: selectedColor,
        strokeWidth: activeTool === 'highlight' ? strokeWidth * 3 : strokeWidth,
        x: pt.x,
        y: pt.y,
        width: 0,
        height: 0,
        startPoint: pt,
        endPoint: pt
      });
    }

    // Capture pointer to prevent losing events outside canvas
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !startPoint) return;
    const pt = getRelativeCoords(e);

    if (activeTool === 'pen' || activeTool === 'highlight') {
      setCurrentPoints(prev => [...prev, pt]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      const x = Math.min(startPoint.x, pt.x);
      const y = Math.min(startPoint.y, pt.y);
      const width = Math.abs(pt.x - startPoint.x);
      const height = Math.abs(pt.y - startPoint.y);

      setCurrentShape({
        type: activeTool as any,
        color: selectedColor,
        strokeWidth,
        x,
        y,
        width,
        height
      });
    } else if (activeTool === 'arrow') {
      setCurrentShape({
        type: 'arrow',
        color: selectedColor,
        strokeWidth,
        startPoint,
        endPoint: pt
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (activeTool === 'pen' || activeTool === 'highlight') {
      if (currentPoints.length > 1) {
        const newAnno: AnnotationItem = {
          id: `anno-${Date.now()}`,
          projectId: 'PKS-994KY1',
          type: activeTool,
          color: selectedColor,
          strokeWidth: activeTool === 'highlight' ? strokeWidth * 4 : strokeWidth,
          points: currentPoints,
          createdAt: new Date().toISOString()
        };
        onAddAnnotation(newAnno);
      }
      setCurrentPoints([]);
    } else if (currentShape && (currentShape.width || currentShape.endPoint)) {
      const newAnno: AnnotationItem = {
        id: `anno-${Date.now()}`,
        projectId: 'PKS-994KY1',
        type: currentShape.type as any,
        color: selectedColor,
        strokeWidth,
        x: currentShape.x,
        y: currentShape.y,
        width: currentShape.width,
        height: currentShape.height,
        startPoint: currentShape.startPoint,
        endPoint: currentShape.endPoint,
        createdAt: new Date().toISOString()
      };
      onAddAnnotation(newAnno);
      setCurrentShape(null);
    }

    setStartPoint(null);
  };

  // Convert points array to SVG path 'M x y L x y...'
  const pointsToSvgPath = (pts: Point[]): string => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  const getCursorClass = () => {
    switch (activeTool) {
      case 'pen':
      case 'highlight':
      case 'rectangle':
      case 'circle':
      case 'arrow':
        return 'cursor-crosshair';
      case 'text':
        return 'cursor-text';
      case 'comment':
        return 'cursor-cell';
      case 'eraser':
        return 'cursor-pointer';
      default:
        return 'cursor-default';
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 z-20 ${
        activeTool === 'select' ? 'pointer-events-none' : 'pointer-events-auto ' + getCursorClass()
      }`}
      style={{ touchAction: activeTool === 'select' ? 'auto' : 'none' }}
    >
      <svg className="w-full h-full absolute inset-0 overflow-visible">
        <defs>
          {/* Arrowhead marker for arrow tool */}
          <marker
            id="arrowhead-red"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#ef4444" />
          </marker>
          <marker
            id="arrowhead-amber"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#f59e0b" />
          </marker>
          <marker
            id="arrowhead-blue"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#3b82f6" />
          </marker>
          <marker
            id="arrowhead-purple"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#8b5cf6" />
          </marker>
          <marker
            id="arrowhead-emerald"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#10b981" />
          </marker>
        </defs>

        {/* 1. Render Saved Annotations */}
        {annotations.map((anno) => {
          const isEraserTarget = activeTool === 'eraser';

          if (anno.type === 'pen' && anno.points) {
            return (
              <path
                key={anno.id}
                d={pointsToSvgPath(anno.points)}
                stroke={anno.color}
                strokeWidth={anno.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-opacity ${isEraserTarget ? 'hover:opacity-30 cursor-pointer pointer-events-auto' : ''}`}
                onClick={(e) => {
                  if (activeTool === 'eraser') {
                    e.stopPropagation();
                    onDeleteAnnotation(anno.id);
                  }
                }}
              />
            );
          }

          if (anno.type === 'highlight' && anno.points) {
            return (
              <path
                key={anno.id}
                d={pointsToSvgPath(anno.points)}
                stroke={anno.color}
                strokeWidth={anno.strokeWidth}
                fill="none"
                opacity={0.35}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-opacity ${isEraserTarget ? 'hover:opacity-10 cursor-pointer pointer-events-auto' : ''}`}
                onClick={(e) => {
                  if (activeTool === 'eraser') {
                    e.stopPropagation();
                    onDeleteAnnotation(anno.id);
                  }
                }}
              />
            );
          }

          if (anno.type === 'rectangle') {
            return (
              <rect
                key={anno.id}
                x={anno.x}
                y={anno.y}
                width={anno.width}
                height={anno.height}
                stroke={anno.color}
                strokeWidth={anno.strokeWidth}
                fill={anno.color}
                fillOpacity={0.06}
                rx={4}
                className={`transition-opacity ${isEraserTarget ? 'hover:opacity-30 cursor-pointer pointer-events-auto' : ''}`}
                onClick={(e) => {
                  if (activeTool === 'eraser') {
                    e.stopPropagation();
                    onDeleteAnnotation(anno.id);
                  }
                }}
              />
            );
          }

          if (anno.type === 'circle') {
            const rx = (anno.width || 0) / 2;
            const ry = (anno.height || 0) / 2;
            const cx = (anno.x || 0) + rx;
            const cy = (anno.y || 0) + ry;

            return (
              <ellipse
                key={anno.id}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                stroke={anno.color}
                strokeWidth={anno.strokeWidth}
                fill={anno.color}
                fillOpacity={0.06}
                className={`transition-opacity ${isEraserTarget ? 'hover:opacity-30 cursor-pointer pointer-events-auto' : ''}`}
                onClick={(e) => {
                  if (activeTool === 'eraser') {
                    e.stopPropagation();
                    onDeleteAnnotation(anno.id);
                  }
                }}
              />
            );
          }

          if (anno.type === 'arrow' && anno.startPoint && anno.endPoint) {
            let markerId = 'arrowhead-red';
            if (anno.color.includes('f59e0b')) markerId = 'arrowhead-amber';
            else if (anno.color.includes('3b82f6')) markerId = 'arrowhead-blue';
            else if (anno.color.includes('8b5cf6')) markerId = 'arrowhead-purple';
            else if (anno.color.includes('10b981')) markerId = 'arrowhead-emerald';

            return (
              <line
                key={anno.id}
                x1={anno.startPoint.x}
                y1={anno.startPoint.y}
                x2={anno.endPoint.x}
                y2={anno.endPoint.y}
                stroke={anno.color}
                strokeWidth={anno.strokeWidth}
                markerEnd={`url(#${markerId})`}
                className={`transition-opacity ${isEraserTarget ? 'hover:opacity-30 cursor-pointer pointer-events-auto' : ''}`}
                onClick={(e) => {
                  if (activeTool === 'eraser') {
                    e.stopPropagation();
                    onDeleteAnnotation(anno.id);
                  }
                }}
              />
            );
          }

          if (anno.type === 'text' && anno.text) {
            return (
              <g
                key={anno.id}
                className={`pointer-events-auto ${isEraserTarget ? 'hover:opacity-40 cursor-pointer' : ''}`}
                onClick={(e) => {
                  if (activeTool === 'eraser') {
                    e.stopPropagation();
                    onDeleteAnnotation(anno.id);
                  }
                }}
              >
                <rect
                  x={(anno.x || 0) - 4}
                  y={(anno.y || 0) - 16}
                  width={anno.text.length * 8 + 12}
                  height={22}
                  fill="#ffffff"
                  fillOpacity={0.9}
                  stroke={anno.color}
                  strokeWidth={1}
                  rx={4}
                />
                <text
                  x={anno.x}
                  y={anno.y}
                  fill={anno.color}
                  fontSize="12px"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {anno.text}
                </text>
              </g>
            );
          }

          return null;
        })}

        {/* 2. Render In-Progress Active Drawing */}
        {isDrawing && currentPoints.length > 0 && (
          <path
            d={pointsToSvgPath(currentPoints)}
            stroke={selectedColor}
            strokeWidth={activeTool === 'highlight' ? strokeWidth * 4 : strokeWidth}
            fill="none"
            opacity={activeTool === 'highlight' ? 0.35 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {isDrawing && currentShape && currentShape.type === 'rectangle' && (
          <rect
            x={currentShape.x}
            y={currentShape.y}
            width={currentShape.width}
            height={currentShape.height}
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            fill={selectedColor}
            fillOpacity={0.08}
            rx={4}
          />
        )}

        {isDrawing && currentShape && currentShape.type === 'circle' && (
          <ellipse
            cx={(currentShape.x || 0) + (currentShape.width || 0) / 2}
            cy={(currentShape.y || 0) + (currentShape.height || 0) / 2}
            rx={(currentShape.width || 0) / 2}
            ry={(currentShape.height || 0) / 2}
            stroke={selectedColor}
            strokeWidth={strokeWidth}
            fill={selectedColor}
            fillOpacity={0.08}
          />
        )}

        {isDrawing && currentShape && currentShape.type === 'arrow' && currentShape.startPoint && currentShape.endPoint && (
          <line
            x1={currentShape.startPoint.x}
            y1={currentShape.startPoint.y}
            x2={currentShape.endPoint.x}
            y2={currentShape.endPoint.y}
            stroke={selectedColor}
            strokeWidth={strokeWidth}
          />
        )}
      </svg>

      {/* 3. Render Interactive Comment Markers on Content */}
      {comments.map((comment, index) => {
        if (comment.x === undefined || comment.y === undefined) return null;

        const isResolved = comment.status === 'resolved';

        return (
          <div
            key={comment.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComment(comment);
            }}
            style={{ left: `${comment.x}%`, top: `${comment.y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto cursor-pointer group"
          >
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md transition-transform group-hover:scale-110 ${
                isResolved
                  ? 'bg-slate-700 text-slate-200 border border-slate-600'
                  : 'bg-rose-600 text-white border border-rose-500 animate-bounce'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{index + 1}</span>
            </div>

            {/* Tooltip on hover */}
            <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-lg z-40 pointer-events-none">
              <div className="font-semibold text-rose-300">{comment.author}</div>
              <div className="truncate">{comment.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
