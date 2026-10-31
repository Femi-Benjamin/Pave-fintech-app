import React, { useState } from "react";

export const ResponsiveContainer = ({
  children,
  width = "100%",
  height = 120,
  className,
}: {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        position: "relative",
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const AreaChart = ({
  data = [],
  children,
  margin = { top: 10, right: 10, left: 10, bottom: 20 },
}: {
  data?: any[];
  children?: React.ReactNode;
  margin?: { top: number; right: number; left: number; bottom: number };
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  let defsNode: React.ReactNode = null;
  let tooltipFormatter: any = null;
  let tooltipStyle: any = null;
  let strokeColor = "#3730A3";
  let fillColor = "url(#spendGrad)";
  let dataKey = "amount";

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === "defs") {
      defsNode = child;
    } else if (
      (child.type as any)?.name === "Tooltip" ||
      (child.props as any)?.formatter
    ) {
      tooltipFormatter = child.props.formatter;
      tooltipStyle = child.props.contentStyle;
    } else if ((child.type as any)?.name === "Area" || child.props.dataKey) {
      if (child.props.dataKey) dataKey = child.props.dataKey;
      if (child.props.stroke) strokeColor = child.props.stroke;
      if (child.props.fill) fillColor = child.props.fill;
    }
  });

  const width = 500;
  const height = 120;
  const padX = 25;
  const padTop = 15;
  const padBottom = 22;

  const values = data.map((d) => Number(d[dataKey]) || 0);
  const maxVal = Math.max(...values, 1000);
  const minVal = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return width / 2;
    return padX + (index / (data.length - 1)) * (width - padX * 2);
  };

  const getY = (val: number) => {
    const usableHeight = height - padTop - padBottom;
    const norm = (val - minVal) / (maxVal - minVal);
    return height - padBottom - norm * usableHeight;
  };

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d[dataKey] || 0),
    data: d,
  }));

  // Build SVG path
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const bottomY = height - padBottom;
    areaD = `${pathD} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }

  return (
    <div className="w-full h-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {defsNode}
        {areaD && <path d={areaD} fill={fillColor} />}
        {pathD && (
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2.5} />
        )}

        {/* Data dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5 : 3.5}
              fill="white"
              stroke={strokeColor}
              strokeWidth={2}
              className="transition-all duration-150 cursor-pointer"
            />
            {/* Invisible hover trigger */}
            <rect
              x={p.x - 20}
              y={0}
              width={40}
              height={height}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 4}
            textAnchor="middle"
            fontSize={10}
            fill="#9CA3AF"
            fontWeight={hoverIndex === i ? 600 : 400}
            fontFamily="var(--font-family-body)"
          >
            {p.data.day || p.data.name || ""}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl shadow-lg text-xs font-semibold whitespace-nowrap bg-white text-[#0D0F1C] border border-black/5"
          style={{
            left: `${(points[hoverIndex].x / width) * 100}%`,
            top: `${(points[hoverIndex].y / height) * 100 - 8}%`,
            ...tooltipStyle,
          }}
        >
          <div className="text-[10px] text-[#9CA3AF] font-normal">
            {points[hoverIndex].data.day}
          </div>
          <div>
            {tooltipFormatter
              ? tooltipFormatter(points[hoverIndex].data[dataKey])
              : `₦${Number(points[hoverIndex].data[dataKey]).toLocaleString()}`}
          </div>
        </div>
      )}
    </div>
  );
};

export const Area = (_props: any) => null;
export const XAxis = (_props: any) => null;
export const YAxis = (_props: any) => null;
export const Tooltip = (_props: any) => null;

export const Cell = (_props: any) => null;

export const PieChart = ({
  width = 160,
  height = 160,
  children,
}: {
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      className="relative flex items-center justify-center"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {children}
      </svg>
    </div>
  );
};

export const Pie = ({
  data = [],
  dataKey = "value",
  innerRadius = 30,
  outerRadius = 45,
  children,
}: any) => {
  const total =
    data.reduce((acc: number, cur: any) => acc + (cur[dataKey] || 0), 0) || 1;
  let cumulative = 0;

  const cells = React.Children.toArray(children);

  return (
    <g>
      {data.map((item: any, i: number) => {
        const val = item[dataKey] || 0;
        const pct = val / total;
        const strokeDasharray = `${pct * 283} 283`;
        const strokeDashoffset = -cumulative * 283;
        cumulative += pct;

        const cell: any = cells[i];
        const color = cell?.props?.fill || item.color || "#3730A3";

        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={color}
            strokeWidth="15"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        );
      })}
    </g>
  );
};

export default {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
};
