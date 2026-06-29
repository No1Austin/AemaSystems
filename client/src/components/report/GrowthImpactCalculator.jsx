import { useState } from "react";
import { MetricCard, ReportCard, SectionTitle } from "./ReportShell";
import { formatCurrency } from "./ReportUtils";

function InputCard({
  label,
  value,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="my-3 text-2xl font-black">
        {prefix}
        {Number(value).toLocaleString()}
        {suffix}
      </p>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </div>
  );
}

export default function GrowthImpactCalculator() {
  const [visitors, setVisitors] = useState(1000);
  const [currentConversion, setCurrentConversion] = useState(2);
  const [targetConversion, setTargetConversion] = useState(5);
  const [averageValue, setAverageValue] = useState(100);

  const currentCustomers = Math.round(visitors * (currentConversion / 100));
  const potentialCustomers = Math.round(visitors * (targetConversion / 100));
  const additionalCustomers = Math.max(potentialCustomers - currentCustomers, 0);
  const monthlyRevenue = additionalCustomers * averageValue;
  const annualRevenue = monthlyRevenue * 12;

  return (
    <ReportCard className="border-emerald-500/20 bg-emerald-500/10">
      <SectionTitle
        eyebrow="Growth impact"
        title="ROI / Growth Impact Projection"
        description="An illustrative estimate showing how improved conversion can affect customers and revenue. This is not a guarantee."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <InputCard
          label="Monthly Visitors"
          value={visitors}
          min={100}
          max={5000}
          step={100}
          onChange={setVisitors}
        />

        <InputCard
          label="Current Conversion"
          value={currentConversion}
          min={1}
          max={20}
          step={1}
          suffix="%"
          onChange={setCurrentConversion}
        />

        <InputCard
          label="Target Conversion"
          value={targetConversion}
          min={1}
          max={30}
          step={1}
          suffix="%"
          onChange={setTargetConversion}
        />

        <InputCard
          label="Avg. Customer Value"
          value={averageValue}
          min={25}
          max={1000}
          step={25}
          prefix="$"
          onChange={setAverageValue}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="Current Customers" value={currentCustomers} tone="blue" />
        <MetricCard label="Potential Customers" value={potentialCustomers} tone="emerald" />
        <MetricCard label="Added Customers" value={`+${additionalCustomers}`} tone="violet" />
        <MetricCard
          label="Potential Monthly Revenue"
          value={`+${formatCurrency(monthlyRevenue)}`}
          tone="emerald"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
        <p className="text-sm text-slate-400">Estimated Annual Opportunity</p>
        <p className="mt-2 text-4xl font-black text-emerald-300">
          +{formatCurrency(annualRevenue)}
        </p>
      </div>
    </ReportCard>
  );
}
