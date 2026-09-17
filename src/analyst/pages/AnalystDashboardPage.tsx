import React from 'react';
import { useAnalyst } from '../context/AnalystContext';
import { QuickActionsBanner } from '../components/dashboard/QuickActionsBanner';
import { StatCardsGrid } from '../components/dashboard/StatCardsGrid';
import { StatusDonutChart } from '../components/dashboard/StatusDonutChart';
import { ReviewTrendLineChart } from '../components/dashboard/ReviewTrendLineChart';
import { ReviewOutcomeBarChart } from '../components/dashboard/ReviewOutcomeBarChart';
import { AttentionProjectsTable } from '../components/dashboard/AttentionProjectsTable';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  FeedSkeleton
} from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export const AnalystDashboardPage: React.FC = () => {
  const { dashboardData, isLoading, errorMessage, refreshData } = useAnalyst();

  // 1. Loading State: Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Banner Skeleton */}
        <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>

        {/* 6 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* 3 Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartSkeleton height="h-80" />
          <ChartSkeleton height="h-80" />
          <ChartSkeleton height="h-80" />
        </div>

        {/* Table & Feed Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TableSkeleton />
          </div>
          <div>
            <FeedSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (errorMessage) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorState
          title="Gagal Memuat Data Dashboard Analyst"
          message={errorMessage}
          onRetry={refreshData}
        />
      </div>
    );
  }

  // 3. Empty State (Jika tidak ada data sama sekali)
  if (!dashboardData || dashboardData.stats.totalProjects === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          title="Belum Ada Proyek Penelitian Terdaftar"
          description="Saat ini belum ada data penelitian yang masuk ke antrean sistem. Saat Peneliti mengirimkan laporan valuasi, status dan aktivitasnya akan tampil di sini."
          actionText="Segarkan Data"
          onAction={refreshData}
        />
      </div>
    );
  }

  // 4. Success State: Tampilan Dashboard Lengkap
  return (
    <div className="space-y-6">
      {/* Quick Action Top Banner */}
      <QuickActionsBanner
        waitingReviewCount={dashboardData.stats.waitingReview}
      />

      {/* 6 Statistik Cards */}
      <section aria-label="Statistik Proyek">
        <StatCardsGrid stats={dashboardData.stats} />
      </section>

      {/* 3 Visualisasi Chart: Status Proyek (Donut), Tren Review (Line), Hasil Review (Bar) */}
      <section aria-label="Grafik dan Analitik Review" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Chart 1: Donut Chart - Status Proyek */}
        <StatusDonutChart
          data={dashboardData.statusDistribution}
          totalProjects={dashboardData.stats.totalProjects}
        />

        {/* Chart 2: Line Chart - Tren Review Proyek */}
        <ReviewTrendLineChart
          data={dashboardData.reviewTrend}
        />

        {/* Chart 3: Bar Chart - Hasil Review */}
        <div className="md:col-span-2 xl:col-span-1">
          <ReviewOutcomeBarChart
            data={dashboardData.reviewOutcomes}
          />
        </div>
      </section>

      {/* Section Bawah: Proyek Membutuhkan Perhatian & Aktivitas Terbaru */}
      <section aria-label="Daftar Proyek dan Aktivitas" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2/3): Tabel Proyek Membutuhkan Perhatian */}
        <div className="lg:col-span-2">
          <AttentionProjectsTable
            projects={dashboardData.attentionProjects}
          />
        </div>

        {/* Kolom Kanan (1/3): Aktivitas Terbaru Feed */}
        <div className="lg:col-span-1">
          <RecentActivityFeed
            activities={dashboardData.recentActivities}
          />
        </div>
      </section>
    </div>
  );
};
