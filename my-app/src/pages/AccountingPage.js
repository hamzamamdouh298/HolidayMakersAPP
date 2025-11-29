import React, { useState, useEffect } from 'react';
import { accountingAPI } from '../services/api';
import '../styles/AccountingPage.css';

const AccountingPage = ({ t, setCurrentPage }) => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0
    });
    const [receiptPayment, setReceiptPayment] = useState({
        currencySummary: {},
        safeDetails: []
    });
    const [banks, setBanks] = useState({
        currencySummary: {},
        bankDetails: []
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, receiptPaymentRes, banksRes] = await Promise.all([
                accountingAPI.getFinancialAnalytics({ startDate: selectedDate }),
                accountingAPI.getReceiptPayment(),
                accountingAPI.getBanks()
            ]);

            if (analyticsRes.status === 'success') {
                setAnalytics(analyticsRes.data);
            }
            if (receiptPaymentRes.status === 'success') {
                setReceiptPayment(receiptPaymentRes.data);
            }
            if (banksRes.status === 'success') {
                setBanks(banksRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch accounting data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount, currency = 'EGP') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace(/[A-Z]{3}/, currency);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num || 0);
    };

    const getCurrencyColor = (amount) => {
        return amount >= 0 ? 'positive' : 'negative';
    };

    const calculateTotals = (items) => {
        const totals = { EGP: 0, USD: 0, SAR: 0, EUR: 0, AED: 0, IQD: 0, KWD: 0 };
        items.forEach(item => {
            Object.keys(totals).forEach(currency => {
                totals[currency] += item[currency] || 0;
            });
        });
        return totals;
    };

    const safeTotals = calculateTotals(receiptPayment.safeDetails || []);
    const bankTotals = calculateTotals(banks.bankDetails || []);

    if (loading) {
        return (
            <div className="accounting-page">
                <div className="loading-message">Loading accounting data...</div>
            </div>
        );
    }

    return (
        <div className="accounting-page">
            {/* Financial Analytics Section */}
            <div className="analytics-section">
                <div className="analytics-header">
                    <div>
                        <h1 className="section-title">Financial Analytics</h1>
                        <p className="section-description">Monitor your business performance in real-time</p>
                    </div>
                    <div className="date-selector">
                        <span className="calendar-icon">📅</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="kpi-card revenue">
                        <div className="kpi-header">
                            <span className="kpi-icon">📈</span>
                            <span className="kpi-title">TOTAL REVENUE</span>
                        </div>
                        <div className="kpi-value">{formatCurrency(analytics.totalRevenue)}</div>
                        <div className="kpi-footer">
                            <span className="kpi-arrow positive">↑</span>
                            <span className="kpi-label">Growth</span>
                        </div>
                    </div>

                    <div className="kpi-card expenses">
                        <div className="kpi-header">
                            <span className="kpi-icon">📊</span>
                            <span className="kpi-title">TOTAL EXPENSES</span>
                        </div>
                        <div className="kpi-value">{formatCurrency(analytics.totalExpenses)}</div>
                        <div className="kpi-footer">
                            <span className="kpi-arrow negative">↓</span>
                            <span className="kpi-label">Costs</span>
                        </div>
                    </div>

                    <div className="kpi-card profit">
                        <div className="kpi-header">
                            <span className="kpi-icon">📈</span>
                            <span className="kpi-title">NET PROFIT</span>
                        </div>
                        <div className="kpi-value">{formatCurrency(analytics.netProfit)}</div>
                        <div className="kpi-footer">
                            <span className="kpi-arrow positive">↑</span>
                            <span className="kpi-label">Profitable</span>
                        </div>
                    </div>

                    <div className="kpi-card margin">
                        <div className="kpi-header">
                            <span className="kpi-icon">%</span>
                            <span className="kpi-title">PROFIT MARGIN</span>
                        </div>
                        <div className="kpi-value">{analytics.profitMargin}%</div>
                        <div className="kpi-footer">
                            <span className="kpi-arrow positive">↑</span>
                            <span className="kpi-label">Margin Rate</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Overview Section */}
            <div className="performance-section">
                <div className="performance-header">
                    <h2 className="section-title">Performance Overview</h2>
                    <div className="performance-filters">
                        <input type="text" placeholder="Year" className="filter-input" />
                        <input type="text" placeholder="Time Range" className="filter-input" />
                        <button className="show-table-btn">
                            <span>📊</span>
                            Show Table
                        </button>
                    </div>
                </div>
                <div className="chart-container">
                    <div className="chart-placeholder">
                        <p>Chart visualization will be implemented here</p>
                        <p className="chart-note">Revenue, Expenses, and Net Profit over time</p>
                    </div>
                </div>
            </div>

            {/* Financial Reports Links */}
            <div className="reports-section">
                <h2 className="section-title">Financial Reports</h2>
                <div className="reports-grid">
                    {['Chart Of Acc', 'Sub Account Statement', 'File Statement', 'Entries', 'Files', 'Cost-accounting', 'Safes', 'Profit and Loss', 'Trial Balance', 'Balance Sheet', 'client. balance in currencies', 'Supp. balance in currencies'].map((report, index) => (
                        <div key={index} className="report-card" onClick={() => setCurrentPage(`report-${report.toLowerCase().replace(/\s+/g, '-')}`)}>
                            {report}
                        </div>
                    ))}
                </div>
            </div>

            {/* Receipt & Payment Section */}
            <div className="receipt-payment-section">
                <div className="section-header-collapsible">
                    <h2 className="section-title">Receipt & Payment</h2>
                    <span className="collapse-arrow">⌄</span>
                </div>

                <div className="currency-cards">
                    {['EGP', 'USD', 'SAR', 'EUR', 'IQD'].map(currency => {
                        const amount = receiptPayment.currencySummary[currency] || 0;
                        return (
                            <div key={currency} className={`currency-card ${getCurrencyColor(amount)}`}>
                                <div className="currency-code">{currency}</div>
                                <div className={`currency-amount ${getCurrencyColor(amount)}`}>
                                    {formatNumber(amount)} {currency}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="table-actions">
                    <button className="print-btn">
                        <span>🖨️</span>
                        Print
                    </button>
                </div>

                <div className="table-container">
                    <h3 className="table-title">Safe</h3>
                    <table className="accounting-table">
                        <thead>
                            <tr>
                                <th>Safe</th>
                                <th>EGP</th>
                                <th>USD</th>
                                <th>SAR</th>
                                <th>EUR</th>
                                <th>AED</th>
                                <th>IQD</th>
                                <th>KWD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptPayment.safeDetails && receiptPayment.safeDetails.length > 0 ? (
                                receiptPayment.safeDetails.map((safe, index) => (
                                    <tr key={index}>
                                        <td>{safe.safeName}</td>
                                        <td className={safe.EGP < 0 ? 'negative' : ''}>{formatNumber(safe.EGP)}</td>
                                        <td className={safe.USD < 0 ? 'negative' : ''}>{formatNumber(safe.USD)}</td>
                                        <td className={safe.SAR < 0 ? 'negative' : ''}>{formatNumber(safe.SAR)}</td>
                                        <td className={safe.EUR < 0 ? 'negative' : ''}>{formatNumber(safe.EUR)}</td>
                                        <td className={safe.AED < 0 ? 'negative' : ''}>{formatNumber(safe.AED)}</td>
                                        <td className={safe.IQD < 0 ? 'negative' : ''}>{formatNumber(safe.IQD)}</td>
                                        <td className={safe.KWD < 0 ? 'negative' : ''}>{formatNumber(safe.KWD)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-data">No safe data available</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td><strong>Total</strong></td>
                                <td className={safeTotals.EGP < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.EGP)}</strong></td>
                                <td className={safeTotals.USD < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.USD)}</strong></td>
                                <td className={safeTotals.SAR < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.SAR)}</strong></td>
                                <td className={safeTotals.EUR < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.EUR)}</strong></td>
                                <td className={safeTotals.AED < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.AED)}</strong></td>
                                <td className={safeTotals.IQD < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.IQD)}</strong></td>
                                <td className={safeTotals.KWD < 0 ? 'negative' : ''}><strong>{formatNumber(safeTotals.KWD)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Banks Section */}
            <div className="banks-section">
                <div className="table-actions">
                    <button className="print-btn">
                        <span>🖨️</span>
                        Print
                    </button>
                </div>

                <div className="table-container">
                    <h3 className="table-title">Banks</h3>
                    <table className="accounting-table">
                        <thead>
                            <tr>
                                <th>Banks</th>
                                <th>EGP</th>
                                <th>USD</th>
                                <th>SAR</th>
                                <th>EUR</th>
                                <th>AED</th>
                                <th>IQD</th>
                                <th>KWD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banks.bankDetails && banks.bankDetails.length > 0 ? (
                                banks.bankDetails.map((bank, index) => (
                                    <tr key={index}>
                                        <td>{bank.bankName}</td>
                                        <td className={bank.EGP < 0 ? 'negative' : ''}>{formatNumber(bank.EGP)}</td>
                                        <td className={bank.USD < 0 ? 'negative' : ''}>{formatNumber(bank.USD)}</td>
                                        <td className={bank.SAR < 0 ? 'negative' : ''}>{formatNumber(bank.SAR)}</td>
                                        <td className={bank.EUR < 0 ? 'negative' : ''}>{formatNumber(bank.EUR)}</td>
                                        <td className={bank.AED < 0 ? 'negative' : ''}>{formatNumber(bank.AED)}</td>
                                        <td className={bank.IQD < 0 ? 'negative' : ''}>{formatNumber(bank.IQD)}</td>
                                        <td className={bank.KWD < 0 ? 'negative' : ''}>{formatNumber(bank.KWD)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-data">No bank data available</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td><strong>Total</strong></td>
                                <td className={bankTotals.EGP < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.EGP)}</strong></td>
                                <td className={bankTotals.USD < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.USD)}</strong></td>
                                <td className={bankTotals.SAR < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.SAR)}</strong></td>
                                <td className={bankTotals.EUR < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.EUR)}</strong></td>
                                <td className={bankTotals.AED < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.AED)}</strong></td>
                                <td className={bankTotals.IQD < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.IQD)}</strong></td>
                                <td className={bankTotals.KWD < 0 ? 'negative' : ''}><strong>{formatNumber(bankTotals.KWD)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountingPage;

