/**
 * 健康报告导出模块
 */

export interface HealthReportData {
  reportDate: string;
  userName: string;
  userBasicInfo: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    bmi: number;
  };
  weekSummary: {
    title: string;
    description: string;
  };
  keyMetrics: {
    riskReduction: number;
    healthScoreImprovement: number;
  };
  reminders: Array<{
    type: string;
    title: string;
    time: string;
    note: string;
  }>;
  seasonalTips: string;
  healthGoals: string[];
  recommendations: string[];
}

/**
 * 将健康报告导出为 PDF（前端生成PDF需要依赖库）
 */
export async function exportHealthReportAsPDF(data: HealthReportData, fileName: string = 'health_report.pdf') {
  // 这里需要使用 jsPDF 或类似库来实际生成 PDF
  // 临时实现为 console 输出和返回 blob
  const html = generateHealthReportHTML(data);
  
  // 如果有 PDF 库可以这样使用：
  // const pdf = new jsPDF();
  // pdf.html(html);
  // pdf.save(fileName);

  // 暂时返回 HTML 供后续处理
  return html;
}

/**
 * 将健康报告导出为 CSV
 */
export function exportHealthReportAsCSV(data: HealthReportData, fileName: string = 'health_report.csv'): void {
  const csv = generateHealthReportCSV(data);
  downloadFile(csv, fileName, 'text/csv');
}

/**
 * 将健康报告导出为图片（需要html2canvas）
 */
export async function exportHealthReportAsImage(
  elementId: string,
  fileName: string = 'health_report.png'
): Promise<void> {
  // 需要 html2canvas 库
  // const canvas = await html2canvas(document.getElementById(elementId));
  // const link = document.createElement('a');
  // link.href = canvas.toDataURL('image/png');
  // link.download = fileName;
  // link.click();

  console.log('需要 html2canvas 库来实现图片导出功能');
}

/**
 * 生成健康报告 HTML 字符串
 */
function generateHealthReportHTML(data: HealthReportData): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>健康报告 - ${data.reportDate}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Microsoft YaHei', Arial, sans-serif;
      background: white;
      padding: 40px;
      color: #1D2A22;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #4BAE5F;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 28px;
      color: #1D2A22;
      margin-bottom: 10px;
    }
    .header p {
      color: #6B7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #15803D;
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 4px solid #4BAE5F;
    }
    .user-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-card {
      background: #F0FBEF;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #BDEFC3;
    }
    .info-label {
      font-size: 12px;
      color: #6B7280;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 18px;
      font-weight: bold;
      color: #1D2A22;
    }
    .summary-box {
      background: #F0FBEF;
      border-left: 4px solid #15803D;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .summary-box h3 {
      color: #15803D;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .summary-box p {
      color: #4B5563;
      line-height: 1.6;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .metric {
      background: #F7FFF4;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #BDEFC3;
      text-align: center;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #15803D;
      margin-bottom: 5px;
    }
    .metric-label {
      font-size: 12px;
      color: #6B7280;
    }
    .list-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      line-height: 1.6;
    }
    .list-bullet {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #4BAE5F;
      border-radius: 50%;
      margin-right: 12px;
      margin-top: 8px;
      flex-shrink: 0;
    }
    .seasonal-box {
      background: #EFF7FF;
      border-left: 4px solid #5BA7F7;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .seasonal-box h3 {
      color: #2563EB;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .seasonal-box p {
      color: #4B5563;
      line-height: 1.6;
      font-size: 14px;
    }
    .goals {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    .goal-tag {
      background: #DCF8D8;
      color: #15803D;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #E5E7EB;
      padding-top: 20px;
      margin-top: 40px;
      color: #6B7280;
      font-size: 12px;
    }
    .timestamp {
      color: #9CA3AF;
      font-size: 12px;
    }
    @media print {
      body { padding: 0; }
      .container { max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 标题 -->
    <div class="header">
      <h1>📊 健康报告</h1>
      <p>食知 FoodSense 个性化健康分析</p>
      <p class="timestamp">报告日期: ${data.reportDate}</p>
    </div>

    <!-- 用户基本信息 -->
    <div class="section">
      <div class="section-title">👤 个人信息</div>
      <div class="user-info">
        <div class="info-card">
          <div class="info-label">姓名</div>
          <div class="info-value">${data.userName}</div>
        </div>
        <div class="info-card">
          <div class="info-label">年龄</div>
          <div class="info-value">${data.userBasicInfo.age} 岁</div>
        </div>
        <div class="info-card">
          <div class="info-label">性别</div>
          <div class="info-value">${data.userBasicInfo.gender}</div>
        </div>
        <div class="info-card">
          <div class="info-label">身高</div>
          <div class="info-value">${data.userBasicInfo.height} cm</div>
        </div>
        <div class="info-card">
          <div class="info-label">体重</div>
          <div class="info-value">${data.userBasicInfo.weight} kg</div>
        </div>
        <div class="info-card">
          <div class="info-label">BMI</div>
          <div class="info-value">${data.userBasicInfo.bmi}</div>
        </div>
      </div>
    </div>

    <!-- 周总结 -->
    <div class="section">
      <div class="section-title">📋 本周小结</div>
      <div class="summary-box">
        <h3>${data.weekSummary.title}</h3>
        <p>${data.weekSummary.description}</p>
      </div>
    </div>

    <!-- 关键指标 -->
    <div class="section">
      <div class="section-title">📈 关键指标</div>
      <div class="metrics">
        <div class="metric">
          <div class="metric-value">↓ ${data.keyMetrics.riskReduction}%</div>
          <div class="metric-label">风险次数下降</div>
        </div>
        <div class="metric">
          <div class="metric-value">↑ ${data.keyMetrics.healthScoreImprovement}%</div>
          <div class="metric-label">健康评分提升</div>
        </div>
      </div>
    </div>

    <!-- 健康目标 -->
    <div class="section">
      <div class="section-title">🎯 健康目标</div>
      <div class="goals">
        ${data.healthGoals.map(goal => `<div class="goal-tag">${goal}</div>`).join('')}
      </div>
    </div>

    <!-- 推荐建议 -->
    <div class="section">
      <div class="section-title">💡 建议</div>
      ${data.recommendations.map(rec => `
        <div class="list-item">
          <div class="list-bullet"></div>
          <div>${rec}</div>
        </div>
      `).join('')}
    </div>

    <!-- 季节建议 -->
    <div class="section">
      <div class="seasonal-box">
        <h3>🌿 季节食膳建议</h3>
        <p>${data.seasonalTips}</p>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>本报告仅为饮食决策辅助工具，不构成医学诊断。如有健康问题，请咨询专业医疗机构。</p>
      <p style="margin-top: 10px;">食知 FoodSense &copy; 2024 - 您的健康饮食伴侣</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 生成健康报告 CSV 字符串
 */
function generateHealthReportCSV(data: HealthReportData): string {
  let csv = '健康报告数据\n\n';

  csv += '报告日期,' + data.reportDate + '\n';
  csv += '用户名字,' + data.userName + '\n\n';

  csv += '基本信息\n';
  csv += '年龄,' + data.userBasicInfo.age + '\n';
  csv += '性别,' + data.userBasicInfo.gender + '\n';
  csv += '身高(cm),' + data.userBasicInfo.height + '\n';
  csv += '体重(kg),' + data.userBasicInfo.weight + '\n';
  csv += 'BMI,' + data.userBasicInfo.bmi + '\n\n';

  csv += '周总结\n';
  csv += '标题,' + data.weekSummary.title + '\n';
  csv += '描述,"' + data.weekSummary.description + '"\n\n';

  csv += '关键指标\n';
  csv += '风险次数下降百分比,' + data.keyMetrics.riskReduction + '%\n';
  csv += '健康评分提升百分比,' + data.keyMetrics.healthScoreImprovement + '%\n\n';

  csv += '健康目标\n';
  data.healthGoals.forEach(goal => {
    csv += goal + '\n';
  });

  csv += '\n推荐建议\n';
  data.recommendations.forEach((rec, index) => {
    csv += (index + 1) + ',' + rec + '\n';
  });

  return csv;
}

/**
 * 下载文件的辅助函数
 */
function downloadFile(content: string, fileName: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 生成导出文件名（包含日期）
 */
export function generateExportFileName(format: 'pdf' | 'csv' | 'png' = 'pdf'): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0');

  const formatMap = {
    pdf: 'pdf',
    csv: 'csv',
    png: 'png'
  };

  return `健康报告_${year}${month}${day}_${time}.${formatMap[format]}`;
}
