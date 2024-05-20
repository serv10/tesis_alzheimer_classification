import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import { getAlzheimerPatientCount } from "src/api";
import { getRandomColor } from "src/functions/ramdonColors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

export function BarChartRealAlzheimerXCount() {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [
      {
        label: "N° Patients",
        data: [],
        backgroundColor: getRandomColor(),
      },
    ],
  });

  useEffect(() => {
    async function loadRealAlzheimerPatientCount() {
      const { data } = await getAlzheimerPatientCount();

      const labels = data.map(
        (item: { Description: string; Count: number }) => item.Description
      );
      const counts = data.map(
        (item: { Description: string; Count: number }) => item.Count
      );

      setChartData((prevChartData) => ({
        ...prevChartData,
        labels,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: counts,
          },
        ],
      }));
    }

    loadRealAlzheimerPatientCount();
  }, []);

  return (
    <div>
      <Bar options={options} data={chartData} />
    </div>
  );
}
