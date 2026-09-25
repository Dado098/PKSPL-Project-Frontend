import React, { useState, useRef, useEffect } from 'react';
import { AnnotationItem, Point, ReviewComment, ToolMode } from '../../types/annotation';
import {
  MessageSquare,
  Trash2,
  Edit2,
  GripVertical,
  Move,
  Check,
  X,
  Type
} from 'lucide-react';

interface AnnotationOverlayProps {
  activeTool?: ToolMode;
  selectedColor?: string;
  strokeWidth?: number;
  annotations: AnnotationItem[];
  comments: ReviewComment[];
  onAddAnnotation?: (anno: AnnotationItem) => void;
  onUpdateAnnotation?: (anno: AnnotationItem) => void;
  onDeleteAnnotation?: (id: string) => void;
  onOpenCommentPin?: (x: number, y: number) => void;
  onSelectComment?: (comment: ReviewComment) => void;
  readOnly?: boolean;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  activeTool = 'select',
  selectedColor = '#ef4444',
  strokeWidth = 2.5,
  annotations,
  comments,
  onAddAnnotation = () => {},
  onUpdateAnnotation,
  onDeleteAnnotation = () => {},
  onOpenCommentPin = () => {},
  onSelectComment = () => {},
  readOnly = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [currentShape, setCurrentShape] = useState<Partial<AnnotationItem> | null>(null);

  // Selection & Dragging state for moving annotations
  const [selectedAnnoId, setSelectedAnnoId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    id: string;
    startMouse: Point;
    originalAnno: AnnotationItem;
    currentAnno: AnnotationItem;
  } | null>(null);

  // Modern Inline Text Composer State (replaces ugly window.prompt)
  const [textComposer, setTextComposer] = useState<{
    x: number;
    y: number;
    editId?: string;
  } | null>(null);
  const [textInput, setTextInput] = useState('');

  // Auto focus input when text composer opens
  useEffect(() => {
    if (textComposer && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [textComposer]);

  // Helper to get relative coordinates from pointer event
  const getRelativeCoords = (e: React.PointerEvent | MouseEvent): Point => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Convert points array to SVG path 'M x y L x y...'
  const pointsToSvgPath = (pts: Point[]): string => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  // Start dragging any annotation (Text, Rectangle, Circle, Arrow, Pen)
  const handleStartDrag = (e: React.PointerEvent, anno: AnnotationItem) => {
    if (readOnly) return;
    e.stopPropagation();
    setSelectedAnnoId(anno.id);

    const pt = getRelativeCoords(e);
    setDragState({
      id: anno.id,
      startMouse: pt,
      originalAnno: { ...anno },
      currentAnno: { ...anno }
    });

    try {
      (e.currentTarget as HTMLElement | SVGElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Open inline text composer for editing
  const handleEditText = (anno: AnnotationItem) => {
    if (readOnly) return;
    setTextComposer({
      x: anno.x || 100,
      y: anno.y || 100,
      editId: anno.id
    });
    setTextInput(anno.text || '');
  };

  // Save text from inline composer
  const handleSaveText = () => {
    const trimmed = textInput.trim();
    if (!trimmed) {
      setTextComposer(null);
      return;
    }

    if (textComposer?.editId) {
      const existing = annotations.find(a => a.id === textComposer.editId);
      if (existing && onUpdateAnnotation) {
        onUpdateAnnotation({
          ...existing,
          text: trimmed
        });
      }
    } else if (textComposer) {
      const newAnno: AnnotationItem = {
        id: `anno-${Date.now()}`,
        projectId: 'PKS-994KY1',
        type: 'text',
        color: selectedColor,
        strokeWidth,
        x: textComposer.x,
        y: textComposer.y,
        text: trimmed,
        createdAt: new Date().toISOString()
      };
      onAddAnnotation(newAnno);
    }

    setTextComposer(null);
    setTextInput('');
  };

  // Pointer Down on workspace canvas
  const handlePointerDown = (e: React.PointerEvent) => {
    if (readOnly || textComposer) return;

    // Deselect if clicking on empty canvas in select mode
    if (activeTool === 'select') {
      setSelectedAnnoId(null);
      return;
    }

    const pt = getRelativeCoords(e);

    // Comment pin tool
    if (activeTool === 'comment') {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const pctX = Math.round((pt.x / rect.width) * 100);
        const pctY = Math.round((pt.y / rect.height) * 100);
        onOpenCommentPin(pctX, pctY);
      }
      return;
    }

    // Modern Text tool: open floating inline composer instead of window.prompt
    if (activeTool === 'text') {
      setTextComposer({ x: pt.x, y: pt.y });
      setTextInput('');
      return;
    }

    // Start drawing shape or freehand path
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

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move on workspace canvas
  const handlePointerMove = (e: React.PointerEvent) => {
    if (readOnly) return;

    // Handle Dragging an existing annotation
    if (dragState) {
      const pt = getRelativeCoords(e);
      const dx = pt.x - dragState.startMouse.x;
      const dy = pt.y - dragState.startMouse.y;
      const orig = dragState.originalAnno;

      let updated: AnnotationItem;
      if (orig.type === 'text' || orig.type === 'rectangle' || orig.type === 'circle') {
        updated = {
          ...orig,
          x: Math.max(0, Math.round((orig.x || 0) + dx)),
          y: Math.max(0, Math.round((orig.y || 0) + dy))
        };
      } else if (orig.type === 'arrow') {
        updated = {
          ...orig,
          startPoint: {
            x: Math.round((orig.startPoint?.x || 0) + dx),
            y: Math.round((orig.startPoint?.y || 0) + dy)
          },
          endPoint: {
            x: Math.round((orig.endPoint?.x || 0) + dx),
            y: Math.round((orig.endPoint?.y || 0) + dy)
          }
        };
      } else {
        // Pen / highlight freehand paths
        updated = {
          ...orig,
          points: (orig.points || []).map(p => ({
            x: Math.round(p.x + dx),
            y: Math.round(p.y + dy)
          }))
        };
      }

      setDragState(prev => prev ? { ...prev, currentAnno: updated } : null);
      return;
    }

    // Handle Active Drawing
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

  // Pointer Up on workspace canvas
  const handlePointerUp = (e: React.PointerEvent) => {
    if (readOnly) return;

    // Finish Dragging annotation and persist to storage
    if (dragState) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      if (onUpdateAnnotation) {
        onUpdateAnnotation(dragState.currentAnno);
      }
      setDragState(null);
      return;
    }

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

  const getCursorClass = () => {
    if (dragState) return 'cursor-grabbing';
    switch (activeTool) {
      case 'select':
        return 'cursor-default';
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

  // Determine effective annotation (live dragged version if currently dragging)
  const getEffectiveAnno = (anno: AnnotationItem) => {
    if (dragState && dragState.id === anno.id) {
      return dragState.currentAnno;
    }
    return anno;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 z-20 ${
        readOnly || activeTool === 'select' ? 'pointer-events-none' : 'pointer-events-auto ' + getCursorClass()
      }`}
      style={{ touchAction: readOnly || activeTool === 'select' ? 'auto' : 'none' }}
    >
      <svg className="w-full h-full absolute inset-0 overflow-visible pointer-events-none">
        <defs>
          {/* Arrowhead marker for arrow tool */}
          <marker id="arrowhead-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#ef4444" />
          </marker>
          <marker id="arrowhead-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#f59e0b" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#3b82f6" />
          </marker>
          <marker id="arrowhead-purple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#8b5cf6" />
          </marker>
          <marker id="arrowhead-emerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="#10b981" />
          </marker>
        </defs>

        {/* 1. Render Saved SVG Annotations (Pen, Highlight, Rectangle, Circle, Arrow) */}
        {annotations.map((rawAnno) => {
          const anno = getEffectiveAnno(rawAnno);
          const isSelected = !readOnly && selectedAnnoId === anno.id;
          const isEraserTarget = !readOnly && activeTool === 'eraser';
          const isSelectMode = !readOnly && activeTool === 'select';

          if (anno.type === 'pen' && anno.points) {
            return (
              <g
                key={anno.id}
                className={readOnly ? 'pointer-events-none' : 'pointer-events-auto'}
                onPointerDown={(e) => {
                  if (isSelectMode) handleStartDrag(e, anno);
                }}
              >
                <path
                  d={pointsToSvgPath(anno.points)}
                  stroke={anno.color}
                  strokeWidth={anno.strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-opacity ${
                    isEraserTarget ? 'hover:opacity-30 cursor-pointer' : isSelectMode ? 'cursor-grab active:cursor-grabbing hover:stroke-opacity-80' : ''
                  }`}
                  onClick={(e) => {
                    if (isEraserTarget) {
                      e.stopPropagation();
                      onDeleteAnnotation(anno.id);
                    }
                  }}
                />
              </g>
            );
          }

          if (anno.type === 'highlight' && anno.points) {
            return (
              <g
                key={anno.id}
                className={readOnly ? 'pointer-events-none' : 'pointer-events-auto'}
                onPointerDown={(e) => {
                  if (isSelectMode) handleStartDrag(e, anno);
                }}
              >
                <path
                  d={pointsToSvgPath(anno.points)}
                  stroke={anno.color}
                  strokeWidth={anno.strokeWidth}
                  fill="none"
                  opacity={0.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-opacity ${
                    isEraserTarget ? 'hover:opacity-10 cursor-pointer' : isSelectMode ? 'cursor-grab active:cursor-grabbing hover:opacity-50' : ''
                  }`}
                  onClick={(e) => {
                    if (isEraserTarget) {
                      e.stopPropagation();
                      onDeleteAnnotation(anno.id);
                    }
                  }}
                />
              </g>
            );
          }

          if (anno.type === 'rectangle') {
            return (
              <g
                key={anno.id}
                className={readOnly ? 'pointer-events-none' : 'pointer-events-auto'}
                onPointerDown={(e) => {
                  if (isSelectMode) handleStartDrag(e, anno);
                }}
              >
                {/* Main Rectangle Box */}
                <rect
                  x={anno.x}
                  y={anno.y}
                  width={anno.width}
                  height={anno.height}
                  stroke={anno.color}
                  strokeWidth={anno.strokeWidth}
                  fill={anno.color}
                  fillOpacity={0.06}
                  rx={6}
                  className={`transition-all ${
                    isEraserTarget
                      ? 'hover:opacity-30 cursor-pointer'
                      : isSelectMode
                      ? 'cursor-grab active:cursor-grabbing hover:fill-opacity-15'
                      : ''
                  }`}
                  onClick={(e) => {
                    if (isEraserTarget) {
                      e.stopPropagation();
                      onDeleteAnnotation(anno.id);
                    } else if (isSelectMode) {
                      e.stopPropagation();
                      setSelectedAnnoId(anno.id);
                    }
                  }}
                />

                {/* Selected Bounding Highlight & Drag Feedback */}
                {isSelected && (
                  <rect
                    x={(anno.x || 0) - 3}
                    y={(anno.y || 0) - 3}
                    width={(anno.width || 0) + 6}
                    height={(anno.height || 0) + 6}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    rx={8}
                    className="pointer-events-none animate-pulse"
                  />
                )}
              </g>
            );
          }

          if (anno.type === 'circle') {
            const rx = (anno.width || 0) / 2;
            const ry = (anno.height || 0) / 2;
            const cx = (anno.x || 0) + rx;
            const cy = (anno.y || 0) + ry;

            return (
              <g
                key={anno.id}
                className={readOnly ? 'pointer-events-none' : 'pointer-events-auto'}
                onPointerDown={(e) => {
                  if (isSelectMode) handleStartDrag(e, anno);
                }}
              >
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  stroke={anno.color}
                  strokeWidth={anno.strokeWidth}
                  fill={anno.color}
                  fillOpacity={0.06}
                  className={`transition-all ${
                    isEraserTarget
                      ? 'hover:opacity-30 cursor-pointer'
                      : isSelectMode
                      ? 'cursor-grab active:cursor-grabbing hover:fill-opacity-15'
                      : ''
                  }`}
                  onClick={(e) => {
                    if (isEraserTarget) {
                      e.stopPropagation();
                      onDeleteAnnotation(anno.id);
                    } else if (isSelectMode) {
                      e.stopPropagation();
                      setSelectedAnnoId(anno.id);
                    }
                  }}
                />
                {isSelected && (
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={rx + 4}
                    ry={ry + 4}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    className="pointer-events-none animate-pulse"
                  />
                )}
              </g>
            );
          }

          if (anno.type === 'arrow' && anno.startPoint && anno.endPoint) {
            let markerId = 'arrowhead-red';
            if (anno.color.includes('f59e0b')) markerId = 'arrowhead-amber';
            else if (anno.color.includes('3b82f6')) markerId = 'arrowhead-blue';
            else if (anno.color.includes('8b5cf6')) markerId = 'arrowhead-purple';
            else if (anno.color.includes('10b981')) markerId = 'arrowhead-emerald';

            return (
              <g
                key={anno.id}
                className={readOnly ? 'pointer-events-none' : 'pointer-events-auto'}
                onPointerDown={(e) => {
                  if (isSelectMode) handleStartDrag(e, anno);
                }}
              >
                <line
                  x1={anno.startPoint.x}
                  y1={anno.startPoint.y}
                  x2={anno.endPoint.x}
                  y2={anno.endPoint.y}
                  stroke={anno.color}
                  strokeWidth={anno.strokeWidth}
                  markerEnd={`url(#${markerId})`}
                  className={`transition-opacity ${
                    isEraserTarget
                      ? 'hover:opacity-30 cursor-pointer'
                      : isSelectMode
                      ? 'cursor-grab active:cursor-grabbing hover:stroke-opacity-80'
                      : ''
                  }`}
                  onClick={(e) => {
                    if (isEraserTarget) {
                      e.stopPropagation();
                      onDeleteAnnotation(anno.id);
                    } else if (isSelectMode) {
                      e.stopPropagation();
                      setSelectedAnnoId(anno.id);
                    }
                  }}
                />
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
            rx={6}
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

      {/* 3. Floating Quick Toolbar for Selected Rectangle / Circle / Shape */}
      {selectedAnnoId && (() => {
        const selectedAnno = annotations.find(a => a.id === selectedAnnoId);
        if (!selectedAnno || selectedAnno.type === 'text') return null;

        const posX = selectedAnno.x || (selectedAnno.startPoint ? Math.min(selectedAnno.startPoint.x, selectedAnno.endPoint?.x || 0) : 0);
        const posY = Math.max(10, (selectedAnno.y || (selectedAnno.startPoint ? Math.min(selectedAnno.startPoint.y, selectedAnno.endPoint?.y || 0) : 0)) - 36);

        return (
          <div
            style={{ left: `${posX}px`, top: `${posY}px` }}
            className="absolute z-40 pointer-events-auto flex items-center gap-1 bg-slate-900/95 text-white px-2.5 py-1 rounded-lg shadow-xl text-xs backdrop-blur-md animate-in fade-in duration-100"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[11px] text-slate-200">
              <Move className="w-3.5 h-3.5 text-blue-400" />
              <span>Geser / Pindahkan</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAnnotation(selectedAnno.id);
                setSelectedAnnoId(null);
              }}
              className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
              title="Hapus shape"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })()}

      {/* 4. Render Beautiful, Draggable HTML Text Note Badges */}
      {annotations.filter(a => a.type === 'text' && a.text).map((rawAnno) => {
        const anno = getEffectiveAnno(rawAnno);
        const isSelected = !readOnly && selectedAnnoId === anno.id;
        const isEraserTarget = !readOnly && activeTool === 'eraser';

        return (
          <div
            key={anno.id}
            style={{
              left: `${anno.x || 0}px`,
              top: `${anno.y || 0}px`
            }}
            onPointerDown={(e) => {
              if (readOnly) return;
              if (isEraserTarget) {
                e.stopPropagation();
                onDeleteAnnotation(anno.id);
                return;
              }
              handleStartDrag(e, anno);
            }}
            onDoubleClick={(e) => {
              if (readOnly) return;
              e.stopPropagation();
              handleEditText(anno);
            }}
            className={`absolute z-30 select-none group pointer-events-auto transition-transform ${
              readOnly
                ? 'cursor-default'
                : isEraserTarget
                ? 'hover:opacity-40 cursor-pointer'
                : 'cursor-grab active:cursor-grabbing hover:scale-101'
            }`}
          >
            <div
              className={`flex items-start gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl transition-all border ${
                isSelected
                  ? 'ring-2 ring-blue-500 shadow-xl border-blue-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                borderLeftWidth: '5px',
                borderLeftColor: anno.color || '#ef4444'
              }}
            >
              {/* Drag Handle Icon - Only if not readOnly */}
              {!readOnly && (
                <div
                  className="mt-0.5 text-slate-400 group-hover:text-slate-700 cursor-grab active:cursor-grabbing shrink-0"
                  title="Klik & geser untuk memindahkan posisi teks catatan"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Text Content */}
              <div className="space-y-0.5 max-w-xs md:max-w-sm">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: anno.color || '#ef4444' }}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {readOnly ? 'Catatan Telaah Analyst (Read-Only)' : 'Catatan Telaah'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-snug whitespace-pre-wrap break-words">
                  {anno.text}
                </p>
              </div>

              {/* Action Buttons (Visible on hover or when selected) - Only if not readOnly */}
              {!readOnly && (
                <div className="flex items-center gap-0.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditText(anno);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Ubah teks catatan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAnnotation(anno.id);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Hapus teks catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 5. Modern Inline Floating Text Composer (Replaces ugly browser prompt) */}
      {!readOnly && textComposer && (
        <div
          style={{
            left: `${Math.min(textComposer.x, (containerRef.current?.clientWidth || 800) - 300)}px`,
            top: `${Math.max(10, textComposer.y - 10)}px`
          }}
          className="absolute z-50 pointer-events-auto w-72 sm:w-80 bg-white/98 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-2xl p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: selectedColor }}
              >
                <Type className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                {textComposer.editId ? 'Ubah Teks Catatan' : 'Teks Catatan Telaah'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setTextComposer(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Batal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Textarea */}
          <div className="space-y-1">
            <textarea
              ref={textInputRef}
              rows={3}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveText();
                } else if (e.key === 'Escape') {
                  setTextComposer(null);
                }
              }}
              placeholder="Tuliskan catatan telaah revisi di sini..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
              <span>Tekan <strong>Enter</strong> untuk simpan</span>
              <span><strong>Shift+Enter</strong> baris baru</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setTextComposer(null)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveText}
              disabled={!textInput.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Render Interactive Comment Markers on Content */}
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-transform group-hover:scale-110 ${
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
