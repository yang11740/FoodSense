'use client';

import type React from 'react';
import { ChevronLeft, ChevronRight, Bell, Shield, Info, HelpCircle, Mail } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface SettingsProps {
  onBack?: () => void;
  onNavigatePage?: (page: 'preferences' | 'goals') => void;
}

interface SettingsItem {
  icon: React.ElementType;
  label: string;
  value?: string;
  page?: 'preferences' | 'goals';
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings({ onBack, onNavigatePage }: SettingsProps) {
  const settingsSections: SettingsSection[] = [
    {
      title: '通知设置',
      items: [
        { icon: Bell, label: '推送通知', value: '已开启' },
        { icon: Bell, label: '语音提醒', value: '已开启' }
      ]
    },
    {
      title: '偏好设置',
      items: [
        {
          icon: Bell,
          label: '饮食偏好',
          value: '',
          page: 'preferences'
        },
        {
          icon: Bell,
          label: '健康目标',
          value: '',
          page: 'goals'
        }
      ]
    },
    {
      title: '隐私与安全',
      items: [
        { icon: Shield, label: '数据隐私', value: '' },
        { icon: Shield, label: '使用条款', value: '' }
      ]
    },
    {
      title: '关于应用',
      items: [
        { icon: Info, label: '关于知膳', value: 'v1.0.0' },
        { icon: HelpCircle, label: '使用帮助', value: '' },
        { icon: Mail, label: '联系我们', value: '' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#EFF7EE] text-[#15803D]"
            aria-label="返回健康中心"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-xl text-gray-900">设置</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-sm text-gray-500 mb-3 px-1">{section.title}</h2>
            <Card className="bg-white shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => item.page && onNavigatePage?.(item.page)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-sm text-gray-500">{item.value}</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* 免责声明 */}
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <h3 className="text-sm text-yellow-900 mb-2">重要提示</h3>
          <p className="text-xs text-yellow-800 leading-relaxed">
            知膳（FoodSense）是一款饮食决策辅助工具，旨在帮助用户更好地了解食物营养信息和潜在健康风险。
            本应用不提供任何医疗诊断、治疗建议或专业医疗咨询。
            如有健康问题，请咨询专业医疗机构。
          </p>
        </Card>
      </div>
    </div>
  );
}
