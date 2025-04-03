import React from "react";

interface RadarChartProps {
  performance: number;
  seo: number;
  accessibility: number;
  techStack: number;
  responsive: number;
  rate: number;
}

export function RadarChart({
  performance,
  seo,
  accessibility,
  techStack,
  responsive,
  rate,
}: RadarChartProps) {
  const size = 200;
  const center = size / 2;
  const radius = size * 0.3;
  const angles = [0, 72, 144, 216, 288];

  const getPoint = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(radian),
      y: center + r * Math.sin(radian),
    };
  };

  const gridLines = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    const points = angles.map((angle) => {
      const point = getPoint(100 * scale, angle);
      return `${point.x},${point.y}`;
    });
    return points.join(" ");
  });

  const dataPoints = [
    { point: getPoint(performance, angles[0]), value: performance },
    { point: getPoint(seo, angles[1]), value: seo },
    { point: getPoint(techStack, angles[2]), value: techStack },
    { point: getPoint(accessibility, angles[3]), value: accessibility },
    { point: getPoint(responsive, angles[4]), value: responsive },
  ];

  const dataPolygon = dataPoints
    .map((d) => `${d.point.x},${d.point.y}`)
    .join(" ");

  const axisLines = angles.map((angle) => {
    const point = getPoint(100, angle);
    return `M${center},${center} L${point.x},${point.y}`;
  });

  const labels = [
    {
      text: "P",
      x: center,
      y: center - radius - 20,
      value: performance,
      valueY: center - radius - 5,
    },
    {
      text: "S",
      x: center + radius + 20,
      y: center - radius * 0.3,
      value: seo,
      valueY: center - radius * 0.3 + 15,
    },
    {
      text: "T",
      x: center + radius * 0.5,
      y: center + radius + 5,
      value: techStack,
      valueY: center + radius + 20,
    },
    {
      text: "A",
      x: center - radius * 0.5,
      y: center + radius + 5,
      value: accessibility,
      valueY: center + radius + 20,
    },
    {
      text: "R",
      x: center - radius - 20,
      y: center - radius * 0.3,
      value: responsive,
      valueY: center - radius * 0.3 + 15,
    },
  ];

  return (
    <div className="w-[200px] h-[200px]">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="レーダーチャート"
      >
        {/* Grid Lines */}
        {gridLines.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="rgba(185, 185, 185, 0.7)"
            strokeWidth="0.8"
          />
        ))}

        {/* Axis Lines */}
        {axisLines.map((d, i) => (
          <path
            key={`axis-${i}`}
            d={d}
            stroke="rgba(220, 229, 235, 0.7)"
            strokeWidth="0.8"
          />
        ))}

        {/* Data Polygon */}
        <polygon
          points={dataPolygon}
          fill="rgba(54, 86, 60, 0.3)"
          stroke="rgba(54, 86, 60, 0.7)"
          strokeWidth="1"
        />

        {/* Data Points */}
        {dataPoints.map((d, i) => (
          <circle
            key={`point-${i}`}
            cx={d.point.x}
            cy={d.point.y}
            r="2"
            fill="rgba(54, 86, 60, 0.8)"
          />
        ))}

        {/* Labels and Values */}
        {labels.map((label, i) => (
          <g key={`label-${i}`}>
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(54, 86, 60, 0.8)"
              style={{ fontSize: "12px", fontWeight: "300" }}
            >
              {label.text}
            </text>
            <text
              x={label.x}
              y={label.valueY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(54, 86, 60, 0.6)"
              style={{ fontSize: "10px", fontWeight: "300" }}
            >
              {label.value.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Center Rate */}
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(54, 86, 60, 0.8)"
          style={{ fontSize: "16px", fontWeight: "300" }}
        >
          {rate.toFixed(1)}
        </text>
      </svg>
    </div>
  );
}
