import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VacationsReport.css';
import vacationService from '../../../Services/VacationsService';
import followService from '../../../Services/FollowService';
import { VacationModel } from '../../../Models/VacationModel';
import { useNavigate } from 'react-router-dom';

Chart.register(...registerables);

const VacationsReport = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [followerCounts, setFollowerCounts] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const vacationsData = await vacationService.getAllVacations();
                setVacations(vacationsData);

                const counts = await Promise.all(vacationsData.map(async (vacation: VacationModel) => {
                    const followers = await followService.getFollowers(vacation.id);
                    return Math.max(0, Math.floor(followers.length));
                }));
                setFollowerCounts(counts);
            } catch (error) {
                console.error("Error fetching vacations or followers:", error);
            }
        };

        fetchVacations();
    }, []);

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');

        if (ctx && vacations.length > 0 && followerCounts.length > 0) {
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: vacations.map(vacation => vacation.destination),
                    datasets: [{
                        label: 'Number of Followers',
                        data: followerCounts,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function (value) {
                                    return Number.isInteger(value) ? value : '';
                                },
                            },
                        },
                    },
                },
            });

            return () => {
                chart.destroy();
            };
        }
    }, [vacations, followerCounts]);

    const downloadCSV = () => {
        const csvRows = [];
        csvRows.push(['Destination', 'Number of Followers']);

        vacations.forEach((vacation, index) => {
            const row = [vacation.destination, followerCounts[index]];
            csvRows.push(row);
        });

        const csvString = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'vacations_report.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="vacations-report">
            <h2>Vacation Report</h2>
            <button className="btnDownload" onClick={downloadCSV}>
                <i className='fas fa-download' style={{ fontSize: '18px', marginRight: '10px' }}></i>
                Download CSV
            </button>
            <div className="report-container">
                <div className="scrollable-chart">
                    <canvas ref={chartRef} width={400} height={300}></canvas>
                </div>
            </div>
            <div className="button-container mb-3">
                <button className="btnGoBack" onClick={() => navigate(-1)}>
                    <i className='fas fa-arrow-left' style={{ fontSize: '18px', marginRight: '10px' }}></i>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default VacationsReport;
