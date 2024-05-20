import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAlzheimerCountsByAgeAndType } from "src/api";
import type { ChartData, ChartOptions } from "chart.js";
import { imageClassification } from "@constants/imageClassification";
import { getRandomColor } from "src/functions/ramdonColors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const calculateInterval = (data: []) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  let k = Math.log2(data.length) + 1;
  const integerPart = Math.floor(k);
  k = integerPart % 2 === 0 ? Math.ceil(k) : integerPart;
  const interval = Math.ceil(range / k);
  return interval;
};

const assignRanges = (data: [], interval: number) => {
  const ranges: { min: number; max: number }[] = [];
  let minAge = Math.min(...data);
  let maxAge = minAge + interval;

  while (minAge <= Math.max(...data)) {
    ranges.push({ min: minAge, max: maxAge });
    minAge = maxAge + 1;
    maxAge = minAge + interval;
  }

  return ranges;
};

const groupDataByRangeAndAlzheimer = (
  data: { Description: string; Age: number; Count: number }[],
  ageRanges: { min: number; max: number }[]
) => {
  const groupedData: {
    [interval: string]: {
      [classification: string]: number;
    };
  } = {};

  ageRanges.forEach(({ min, max }) => {
    const rangeKey = `${min}-${max}`;
    groupedData[rangeKey] = {};

    data.forEach(({ Description, Age, Count }) => {
      if (Age >= min && Age <= max) {
        if (!groupedData[rangeKey][Description]) {
          groupedData[rangeKey][Description] = 0;
        }
        groupedData[rangeKey][Description] += Count;
      }
    });
  });

  return groupedData;
};

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Classication Alzheimer X Real Values",
    },
  },
};

export const BarChartStacked = () => {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function loadRealAlzheimerPatientCount() {
      const { data } = await getAlzheimerCountsByAgeAndType();

      const ages = data.map(
        (item: { Description: string; Age: number; Count: number }) => item.Age
      );

      const interval = calculateInterval(ages);
      const ageRanges = assignRanges(ages, interval);
      const groupedData = groupDataByRangeAndAlzheimer(data, ageRanges);

      const intervals = Object.keys(groupedData);
      const alzheimerTypes = Object.values(imageClassification);

      const datasets = alzheimerTypes.map((type) => ({
        label: type,
        data: intervals.map((interval) => groupedData[interval][type] || 0),
        backgroundColor: getRandomColor(),
      }));

      setChartData({ labels: intervals, datasets: datasets });
    }

    loadRealAlzheimerPatientCount();
  }, []);

  return (
    <div>
      <Bar options={options} data={chartData} />
    </div>
  );
};
