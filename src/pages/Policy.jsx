import React from 'react';
import { Shield, Package, RefreshCw, Lock } from 'lucide-react';

export default function Policy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Chính sách & Điều khoản</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Vui lòng đọc kỹ các chính sách và điều khoản sử dụng của chúng tôi
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chính sách bảo mật</h3>
                            <p className="text-gray-600">Thông tin cá nhân của bạn được bảo vệ tuyệt đối và không chia sẻ với bên thứ ba</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chính sách vận chuyển</h3>
                            <p className="text-gray-600">Miễn phí vận chuyển cho đơn hàng trên 500.000đ, giao hàng toàn quốc 2-5 ngày</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <RefreshCw className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chính sách đổi trả</h3>
                            <p className="text-gray-600">Đổi trả trong vòng 7 ngày, hoàn tiền 100% nếu sản phẩm lỗi</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Lock className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo mật thanh toán</h3>
                            <p className="text-gray-600">Thanh toán an toàn với mã hóa SSL, hỗ trợ nhiều phương thức thanh toán</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Chính sách bảo mật thông tin</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>1.1. Mục đích thu thập:</strong> Chúng tôi thu thập thông tin cá nhân của bạn để:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Xử lý đơn hàng và giao hàng</li>
                                <li>Cung cấp dịch vụ chăm sóc khách hàng</li>
                                <li>Gửi thông tin khuyến mãi (chỉ khi có sự đồng ý)</li>
                                <li>Cải thiện trải nghiệm mua sắm</li>
                            </ul>
                            <p><strong>1.2. Phạm vi sử dụng:</strong> Thông tin của bạn chỉ được sử dụng trong nội bộ công ty và không được chia sẻ với bên thứ ba trừ khi có yêu cầu pháp lý.</p>
                            <p><strong>1.3. Bảo mật:</strong> Chúng tôi cam kết bảo vệ thông tin của bạn bằng các biện pháp bảo mật tiên tiến.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Chính sách vận chuyển</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>2.1. Phí vận chuyển:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên</li>
                                <li>Phí vận chuyển cố định 30.000đ cho đơn hàng dưới 500.000đ</li>
                                <li>Phí vận chuyển ngoại thành có thể phát sinh thêm</li>
                            </ul>
                            <p><strong>2.2. Thời gian giao hàng:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Nội thành Hà Nội: 1-2 ngày làm việc</li>
                                <li>Các tỉnh thành khác: 3-5 ngày làm việc</li>
                                <li>Vùng sâu, vùng xa: 5-7 ngày làm việc</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Chính sách đổi trả hàng</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>3.1. Điều kiện đổi trả:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>
                                <li>Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng</li>
                                <li>Có hóa đơn mua hàng</li>
                                <li>Sản phẩm không thuộc danh mục không đổi trả</li>
                            </ul>
                            <p><strong>3.2. Hoàn tiền:</strong> Hoàn tiền qua chuyển khoản trong vòng 5-7 ngày làm việc sau khi xác nhận đổi trả.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-8 text-white">
                        <h2 className="text-2xl font-bold mb-4">Thông tin liên hệ</h2>
                        <p className="mb-4">Nếu bạn có bất kỳ câu hỏi nào về chính sách của chúng tôi, vui lòng liên hệ:</p>
                        <div className="space-y-2">
                            <p><strong>Email:</strong> support@fashionstore.com</p>
                            <p><strong>Hotline:</strong> +84 123 456 789</p>
                            <p><strong>Địa chỉ:</strong> Trường Đại học Nông nghiệp Hà Nội, Trâu Quỳ, Gia Lâm, Hà Nội</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
