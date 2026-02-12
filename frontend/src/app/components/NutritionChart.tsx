import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutritionData {
  carbs: number;
  protein: number;
  fat: number;
}

interface NutritionChartProps {
  data: NutritionData;
}

const COLORS = {
  carbs: '#3b82f6',    // 蓝色 - 碳水化合物
  protein: '#10b981',  // 绿色 - 蛋白质
  fat: '#f59e0b'       // 橙色 - 脂肪
};

export default function NutritionChart({ data }: NutritionChartProps) {
  const chartData = [
    { name: '碳水化合物', value: data.carbs, color: COLORS.carbs },
    { name: '蛋白质', value: data.protein, color: COLORS.protein },
    { name: '脂肪', value: data.fat, color: COLORS.fat }
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700">{value} ({entry.payload.value}%)</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
