"use client";
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AnimatedPieChart = ({ chartData, className = "w-full"}) => {
    const [mounted, setMounted] = useState(false);

    // Enhanced color schemes for light and dark modes
    const colors = {
        light: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        dark: ['#60a5fa', '#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#f87171']
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="px-4 py-3 rounded-lg shadow-lg border transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm opacity-75">
                        Value: <span className="font-medium">{data.value}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom label component
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="currentColor"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-semibold fill-gray-900 dark:fill-white"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>

                <div className={`relative ${className}`}>
                    <div className="absolute inset-0 rounded-xl blur-xl opacity-20 bg-purple-500 dark:bg-blue-500"></div>
                    <div className="relative h-80 md:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    outerRadius={120}
                                    innerRadius={40}
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={colors.light[index]}
                                            stroke="#ffffff"
                                            strokeWidth={3}
                                            className="dark:stroke-gray-800"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                    className="text-gray-900 dark:text-white"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </>
    );
};

export default AnimatedPieChart;