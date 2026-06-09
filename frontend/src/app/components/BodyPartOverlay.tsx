import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { BodyPartName } from '@/app/types/bodyPart';
import { getBodyPartInfo, getAffectedBodyParts } from '@/app/types/bodyPart';
import { getBodyPartFoodRecommendations, getCurrentSeason } from '@/app/types/bodyPartFoodRecommendation';

interface BodyPartOverlayProps {
  healthIssues: string[];
  onPartClick?: (part: BodyPartName) => void;
}

/**
 * 可交互的身体部位热力图
 * 显示身体各部位的健康状态，可点击查看详情
 */
export default function BodyPartOverlay({ healthIssues, onPartClick }: BodyPartOverlayProps) {
  const [selectedPart, setSelectedPart] = useState<BodyPartName | null>(null);
  const [affectedParts, setAffectedParts] = useState<BodyPartName[]>([]);
  const season = getCurrentSeason();

  useEffect(() => {
    const parts = getAffectedBodyParts(healthIssues);
    setAffectedParts(parts);
  }, [healthIssues]);

  const handlePartClick = (part: BodyPartName) => {
    setSelectedPart(part);
    onPartClick?.(part);
  };

  const closePanel = () => {
    setSelectedPart(null);
  };

  // 简化的身体部位热力图 - 使用圆形指示器
  const bodyParts: Array<{
    name: BodyPartName;
    label: string;
    position: { x: number; y: number };
    size: number;
  }> = [
    { name: '头部', label: '头', position: { x: 50, y: 12 }, size: 20 },
    { name: '颈部', label: '颈', position: { x: 50, y: 22 }, size: 12 },
    { name: '心脏', label: '心', position: { x: 50, y: 32 }, size: 16 },
    { name: '肺部', label: '肺', position: { x: 40, y: 32 }, size: 14 },
    { name: '胃部', label: '胃', position: { x: 50, y: 42 }, size: 14 },
    { name: '肝脏', label: '肝', position: { x: 58, y: 42 }, size: 14 },
    { name: '肾脏', label: '肾', position: { x: 42, y: 42 }, size: 12 },
    { name: '腹部', label: '腹', position: { x: 50, y: 52 }, size: 18 },
    { name: '肠道', label: '肠', position: { x: 50, y: 62 }, size: 16 },
    { name: '左臂', label: '左臂', position: { x: 20, y: 40 }, size: 12 },
    { name: '右臂', label: '右臂', position: { x: 80, y: 40 }, size: 12 },
    { name: '脊椎', label: '脊', position: { x: 50, y: 55 }, size: 14 },
    { name: '左腿', label: '左腿', position: { x: 35, y: 75 }, size: 14 },
    { name: '右腿', label: '右腿', position: { x: 65, y: 75 }, size: 14 },
  ];

  return (
    <div className="space-y-4">
      {/* 身体热力图 */}
      <div className="relative w-full aspect-[3/4] rounded-2xl bg-gradient-to-b from-[#F0FBEF] to-[#E8F8E4] border-2 border-[#BDEFC3] shadow-inner overflow-hidden">
        {/* 标题 */}
        <div className="absolute top-3 left-3 z-10">
          <p className="text-xs font-semibold text-[#4B5563]">点击部位查看详情</p>
        </div>

        {/* SVG 背景：简化的人体轮廓 */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 100 140"
          preserveAspectRatio="none"
        >
          {/* 头 */}
          <circle cx="50" cy="15" r="8" fill="#4BAE5F" />
          {/* 躯干 */}
          <rect x="40" y="25" width="20" height="35" rx="10" fill="#4BAE5F" />
          {/* 左臂 */}
          <rect x="25" y="30" width="15" height="8" rx="4" fill="#4BAE5F" />
          {/* 右臂 */}
          <rect x="60" y="30" width="15" height="8" rx="4" fill="#4BAE5F" />
          {/* 左腿 */}
          <rect x="38" y="62" width="8" height="30" rx="4" fill="#4BAE5F" />
          {/* 右腿 */}
          <rect x="54" y="62" width="8" height="30" rx="4" fill="#4BAE5F" />
        </svg>

        {/* 可点击的身体部位指示器 */}
        <div className="absolute inset-0 w-full h-full">
          {bodyParts.map((part) => {
            const isAffected = affectedParts.includes(part.name);
            const isSelected = selectedPart === part.name;

            return (
              <button
                key={part.name}
                onClick={() => handlePartClick(part.name)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#15803D]"
                style={{
                  left: `${part.position.x}%`,
                  top: `${part.position.y}%`,
                }}
                aria-label={`点击查看${part.label}部位信息`}
              >
                <div
                  className={`rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isAffected
                      ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-300'
                      : isSelected
                        ? 'bg-[#15803D] text-white shadow-lg ring-2 ring-[#4BAE5F]'
                        : 'bg-[#BDEFC3] text-[#15803D] hover:bg-[#9DD4A6] shadow-md'
                  }`}
                  style={{
                    width: `${part.size * 2.5}px`,
                    height: `${part.size * 2.5}px`,
                  }}
                >
                  {/* 缩写标签 */}
                  <span className="text-[10px]">{part.label.charAt(0)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 健康状态指示图例 */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-[#4B5563]">需关注</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#15803D]"></div>
            <span className="text-[#4B5563]">已选中</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#BDEFC3]"></div>
            <span className="text-[#4B5563]">正常</span>
          </div>
        </div>
      </div>

      {/* 详情面板 */}
      {selectedPart && (
        <BodyPartDetailsPanel
          part={selectedPart}
          onClose={closePanel}
          season={season}
        />
      )}
    </div>
  );
}

/**
 * 身体部位详情面板
 */
interface BodyPartDetailsPanelProps {
  part: BodyPartName;
  onClose: () => void;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

function BodyPartDetailsPanel({ part, onClose, season }: BodyPartDetailsPanelProps) {
  const partInfo = getBodyPartInfo(part);
  const foodRec = getBodyPartFoodRecommendations(part);

  const seasonNames = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季'
  };

  return (
    <div className="rounded-2xl border-2 border-[#BDEFC3] bg-[#F0FBEF] p-5 shadow-md">
      {/* 标题和关闭按钮 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1D2A22]">{partInfo.displayName}</h3>
          <p className="text-sm text-[#6B7280] mt-1">{partInfo.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#DCF8D8] transition-colors"
          aria-label="关闭详情"
        >
          <X className="w-5 h-5 text-[#15803D]" strokeWidth={2} />
        </button>
      </div>

      {/* 健康风险 */}
      {partInfo.healthRisks.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-[#FFF7E6] border border-[#FFD88A]">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#FFB84D] mt-0.5 flex-shrink-0" strokeWidth={2} />
            <span className="text-sm font-semibold text-[#B7791F]">可能的风险因素</span>
          </div>
          <ul className="space-y-1 text-sm text-[#B7791F]">
            {partInfo.healthRisks.map((risk) => (
              <li key={risk} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB84D]"></span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 推荐食物 */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-[#1D2A22] mb-2">✓ 推荐食物</h4>
        <div className="flex flex-wrap gap-2">
          {foodRec.recommendedFoods.map((food) => (
            <span key={food} className="px-3 py-1 rounded-full bg-[#DCF8D8] text-sm text-[#15803D] font-medium">
              {food}
            </span>
          ))}
        </div>
      </div>

      {/* 避免食物 */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-[#1D2A22] mb-2">✗ 应避免食物</h4>
        <div className="flex flex-wrap gap-2">
          {foodRec.avoidFoods.map((food) => (
            <span key={food} className="px-3 py-1 rounded-full bg-[#FFE4CC] text-sm text-[#B7791F] font-medium">
              {food}
            </span>
          ))}
        </div>
      </div>

      {/* 健康益处 */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-[#1D2A22] mb-2">💪 健康益处</h4>
        <ul className="space-y-1">
          {foodRec.benefits.map((benefit) => (
            <li key={benefit} className="text-sm text-[#4B5563] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4BAE5F]"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* 季节提示 */}
      <div className="p-3 rounded-lg bg-[#EFF7FF] border border-[#BFDBFE]">
        <h4 className="text-sm font-bold text-[#2563EB] mb-1">{seasonNames[season]}建议</h4>
        <p className="text-sm text-[#2563EB]">{foodRec.seasonalTips[season]}</p>
      </div>
    </div>
  );
}
