// LineRace.js
import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import styled from 'styled-components';
import { Card } from 'antd';
import StatisticService from 'src/services/StatisticService';
import { toast } from 'react-toastify';

// Styled component for the Card
const LineRaceWrapper = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;


const LineRace = () => {

  const [loading, setLoading] = useState(false)
  const [currentData, setCurrentData] = useState([])
  const [currentMonth, setCurrentMonth] = useState(0)
  const [booking, setBooking] = useState([])

  const statisticBooking = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticBooking()
      if (res?.isError) return toast.error(res?.msg)
      setBooking(res?.data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    statisticBooking()
  }, [])

  useEffect(() => {
    if (booking.length > 0) {
      const interval = setInterval(() => {
        setCurrentMonth((prev) => {
          const nextMonth = prev + 1;
          if (nextMonth > booking.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return nextMonth;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [booking]);

  useEffect(() => {
    if (booking[currentMonth]) {
      setCurrentData((prev) => [...prev, booking[currentMonth]]);
    }
  }, [currentMonth, booking]);

  const getOption = () => ({
    title: {
      text: 'Thống kê đặt lịch',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: currentData.map(item => item?.Month),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: currentData.map(item => item?.Total),
        type: 'line',
        smooth: true,
      },
    ],
  });

  return (
    <LineRaceWrapper >
      <ReactEcharts option={getOption()} style={{ height: '300px', width: '100%' }} />
    </LineRaceWrapper>
  );
};

export default LineRace;
