import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, Pagination, message } from 'antd';
import dayjs from 'dayjs';
import { getListPayment } from '@/apis/paymentService';
import { getProfile } from '@/apis/authService';
import { getBankData } from '@/components/bank-name/bankName';

const PaymentHistory = () => {
    const [paymentItems, setPaymentItems] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    // Hàm định dạng tiền tệ
    const formatCurrency = (amount) => {
        if (!amount) return '0';
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    // Total deposited
    const totalDeposited = useMemo(() => {
        return paymentItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    }, [paymentItems]);

    // Hàm lấy danh sách giao dịch thanh toán
    const fetchPayments = async () => {
        try {
            const profileResponse = await getProfile();
            const userId = profileResponse.data.id;
            const params = {
                userId,
                start: Math.max(pagination.current - 1, 0),
                limit: pagination.pageSize,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
                endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
            };
            const res = await getListPayment(params);
            if (res.data && res.data.items) {
                setPaymentItems(res.data.items);
                setPagination(prev => ({ ...prev, total: res.data.total || 0 }));
            } else {
                throw new Error('Dữ liệu API không hợp lệ');
            }
        } catch (error) {
            message.error(`Lỗi tải dữ liệu: ${error.message}`);
        }
    };

    // Hàm xử lý thay đổi trang
    const handlePaginationChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize,
        }));
    };

    // Hàm xử lý khi thay đổi ngày lọc
    const handleDateChange = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    // Hàm vô hiệu hóa ngày kết thúc không hợp lệ
    const disabledEndDate = (current) => {
        if (!startDate) return false;
        return current && current.isBefore(startDate, 'day');
    };

    // Hàm vô hiệu hóa ngày bắt đầu không hợp lệ
    const disabledStartDate = (current) => {
        if (!endDate) return false;
        return current && current.isAfter(endDate, 'day');
    };

    useEffect(() => {
        fetchPayments();
    }, [pagination.current, pagination.pageSize, startDate, endDate]);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Lịch sử thanh toán</h1>
                <p className="text-gray-500 mt-1 text-sm">Xem tất cả giao dịch thanh toán của bạn</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-1">Tổng số tiền đã thanh toán</div>
                <div className="text-3xl font-bold">{formatCurrency(totalDeposited)}₫</div>
                <div className="text-sm opacity-75 mt-2">{paymentItems.length} giao dịch</div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <span className="text-sm font-medium text-gray-700">Lọc theo ngày:</span>
                    <div className="flex items-center gap-2 flex-1">
                        <DatePicker
                            value={startDate}
                            placeholder="Từ ngày"
                            onChange={(date) => {
                                setStartDate(date);
                                handleDateChange();
                            }}
                            disabledDate={disabledStartDate}
                            className="flex-1"
                        />
                        <span className="text-gray-400">→</span>
                        <DatePicker
                            value={endDate}
                            placeholder="Đến ngày"
                            onChange={(date) => {
                                setEndDate(date);
                                handleDateChange();
                            }}
                            disabledDate={disabledEndDate}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
                {paymentItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        {/* Header Row */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Mã giao dịch</div>
                                <div className="font-medium text-gray-900">{item.orderCode}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 mb-1">Số tiền</div>
                                <div className="text-xl font-bold text-teal-600">
                                    {formatCurrency(item.amount)}₫
                                </div>
                            </div>
                        </div>

                        {/* Details Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Ngày giao dịch</div>
                                <div className="text-gray-900">{item.transactionDateTime}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Số tài khoản</div>
                                <div className="text-gray-900 font-mono">{item.counterAccountNumber}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs mb-1">Ngân hàng</div>
                                <div className="flex items-center gap-2">
                                    {getBankData(item.counterAccountBankId).logo && (
                                        <img
                                            src={getBankData(item.counterAccountBankId).logo}
                                            alt="Bank Logo"
                                            className="w-5 h-5 rounded"
                                        />
                                    )}
                                    <span className="text-gray-900">
                                        {getBankData(item.counterAccountBankId).name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {paymentItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-5xl mb-3">💳</div>
                        <p className="text-gray-500">Chưa có giao dịch nào</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {paymentItems.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={pagination.current}
                        total={pagination.total}
                        pageSize={pagination.pageSize}
                        showSizeChanger={true}
                        pageSizeOptions={['6', '10', '20']}
                        onChange={handlePaginationChange}
                        onShowSizeChange={handlePaginationChange}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
