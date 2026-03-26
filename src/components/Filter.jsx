import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import ReactSlider from 'react-slider';

const Filter = ({ firstClass, onFiltersUpdate }) => {
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedSecondClasses, setSelectedSecondClasses] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const secondClassOptions = {
        QUAN_AO: [
            { label: "Áo thun", value: "Áo thun" },
            { label: "Áo sơ mi", value: "Áo sơ mi" },
            { label: "Áo kiểu", value: "Áo kiểu" },
            { label: "Áo khoác", value: "Áo khoác" },
            { label: "Quần dài", value: "Quần dài" },
            { label: "Quần ngắn", value: "Quần ngắn" },
            { label: "Váy", value: "Váy" },
            { label: "Đồ lót", value: "Đồ lót" },
            { label: "Đồ mặc nhà", value: "Đồ mặc nhà" }
        ],
        TUI_XACH: [
            { label: "Ví", value: "Ví" },
            { label: "Túi xách", value: "Túi xách" },
            { label: "Balo", value: "Balo" },
            { label: "Vali", value: "Vali" }
        ],
        PHU_KIEN: [
            { label: "Nón&Mũ", value: "Nón&Mũ" },
            { label: "Khăn Choàng", value: "Khăn Choàng" },
            { label: "Tất", value: "Tất" },
            { label: "Găng tay", value: "Găng tay" }
        ]
    };

    const sizeOptions = [
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "2XL", value: "2XL" },
        { label: "3XL", value: "3XL" },
        { label: "4XL", value: "4XL" },
    ];

    const materialOptions = [
        { label: "Cotton", value: "Cotton" },
        { label: "Polyester", value: "Polyester" },
        { label: "Nylon", value: "Nylon" },
        { label: "Wool", value: "Wool" },
        { label: "Spandex", value: "Spandex" },
        { label: "Modal", value: "Modal" },
        { label: "Kapok", value: "Kapok" },
    ];

    // Danh sách màu sắc - mapping đúng với dữ liệu backend
    const colorOptions = [
        { label: "Be", value: "Be", color: "#F5F5DC" }, // Từ API response
        { label: "Đỏ", value: "Đỏ", color: "#FF0000" },
        { label: "Xanh", value: "Xanh", color: "#0000FF" },
        { label: "Vàng", value: "Vàng", color: "#FFFF00" },
        { label: "Đen", value: "Đen", color: "#000000" },
        { label: "Trắng", value: "Trắng", color: "#FFFFFF" },
        { label: "Hồng", value: "Hồng", color: "#FFC0CB" },
        { label: "Xám", value: "Xám", color: "#808080" },
    ];

    const currentSecondClassOptions = firstClass ? (secondClassOptions[firstClass] || []) : [];

    // Hàm bật/tắt lựa chọn phân loại sản phẩm
    const toggleSecondClass = (value) => {
        setSelectedSecondClasses(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    // Hàm bật/tắt lựa chọn kích thước
    const toggleSize = (value) => {
        setSelectedSizes(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    // Hàm bật/tắt lựa chọn chất liệu
    const toggleMaterial = (value) => {
        setSelectedMaterials(prev =>
            prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
        );
    };

    // Hàm bật/tắt lựa chọn màu sắc
    const toggleColor = (value) => {
        setSelectedColors(prev =>
            prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
        );
    };

    // Hàm đặt lại toàn bộ bộ lọc về mặc định
    const resetAll = () => {
        setPriceRange([0, 1000]);
        setSelectedSecondClasses([]);
        setSelectedSizes([]);
        setSelectedMaterials([]);
        setSelectedColors([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sử dụng useRef để lưu giá trị trước đó và tránh gọi API không cần thiết
    const prevFiltersRef = useRef(null);

    // Theo dõi thay đổi của các bộ lọc để cập nhật
    useEffect(() => {
        const newFilters = {
            priceRange,
            sizesSelected: selectedSizes,
            materialsSelected: selectedMaterials,
            colorsSelected: selectedColors,
            secondClassesSelected: selectedSecondClasses,
        };

        // So sánh với giá trị trước đó để tránh gọi API không cần thiết
        const filtersString = JSON.stringify(newFilters);
        if (prevFiltersRef.current !== filtersString) {
            prevFiltersRef.current = filtersString;
            onFiltersUpdate(newFilters);
        }
    }, [priceRange, selectedSizes, selectedMaterials, selectedColors, selectedSecondClasses]);

    // Theo dõi thay đổi firstClass để reset secondClass
    useEffect(() => {
        setSelectedSecondClasses([]);
    }, [firstClass]);

    return (
        <aside className="hidden md:block w-80 bg-white p-4">
            <span className="font-extrabold text-base mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                <span>Bộ lọc</span>
            </span>

            {/* Bộ lọc khoảng giá */}
            <div className="mb-6">
                <div className="p-3 text-left">
                    <span className="font-bold text-base mb-2">Khoảng giá</span>
                </div>
                <div className="px-3">
                    <ReactSlider
                        className="horizontal-slider"
                        thumbClassName="slider-thumb"
                        trackClassName="slider-track"
                        value={priceRange}
                        onChange={setPriceRange}
                        min={0}
                        max={1000}
                        step={1}
                        pearling
                        minDistance={5}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>{(priceRange[0] * 10000).toLocaleString('vi-VN')} đ</span>
                        <span>{(priceRange[1] * 10000).toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
            </div>

            {/* Bộ lọc phân loại */}
            <div className="mb-4">
                <div className="p-3 text-left">
                    <span className="font-bold text-base mb-2">Phân loại</span>
                </div>
                {currentSecondClassOptions.length > 0 ? (
                    <div className="grid grid-cols-1">
                        {currentSecondClassOptions.map((secondClass) => (
                            <div
                                key={secondClass.value}
                                className={`flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500 ${selectedSecondClasses.includes(secondClass.value) ? 'text-stone-500' : ''
                                    }`}
                                onClick={() => toggleSecondClass(secondClass.value)}
                            >
                                <div className="relative">
                                    <div
                                        className={`w-5 h-5 border border-gray-300 rounded flex items-center justify-center ${selectedSecondClasses.includes(secondClass.value)
                                            ? 'bg-stone-500 border-stone-500'
                                            : ''
                                            }`}
                                    >
                                        {selectedSecondClasses.includes(secondClass.value) && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                </div>
                                <span className="ml-2 text-xs font-medium">{secondClass.label}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-gray-400 p-2">
                        Không có phân loại cho {firstClass}
                    </div>
                )}
            </div>

            {/* Bộ lọc size */}
            <div className="mb-4">
                <div className="p-3 text-left">
                    <span className="font-bold text-base mb-2">Size</span>
                </div>
                <div className="grid grid-cols-2">
                    {sizeOptions.map((size) => (
                        <div
                            key={size.value}
                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500 ${selectedSizes.includes(size.value) ? 'text-stone-500' : ''
                                }`}
                            onClick={() => toggleSize(size.value)}
                        >
                            <div className="relative">
                                <div
                                    className={`w-5 h-5 border border-gray-300 rounded flex items-center justify-center ${selectedSizes.includes(size.value)
                                        ? 'bg-stone-500 border-stone-500'
                                        : ''
                                        }`}
                                >
                                    {selectedSizes.includes(size.value) && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </div>
                            </div>
                            <span className="ml-2 text-xs font-medium">{size.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bộ lọc màu sắc */}
            <div className="mb-4">
                <div className="p-3 text-left">
                    <span className="font-bold text-base mb-2">Màu sắc</span>
                </div>
                <div className="grid grid-cols-4 gap-2 px-3">
                    {colorOptions.map((color) => (
                        <div
                            key={color.value}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                            onClick={() => toggleColor(color.value)}
                        >
                            <div className="relative">
                                {selectedColors.includes(color.value) ? (
                                    <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center p-0.5">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: color.color }}
                                        >
                                            <Check
                                                className={`w-4 h-4 ${['#FFFFFF', '#FFFFF0', '#F5F5DC'].includes(color.color)
                                                    ? 'text-gray-800'
                                                    : 'text-white'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: color.color }}
                                    />
                                )}
                            </div>
                            <span className="text-xs text-center font-medium">{color.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bộ lọc chất liệu */}
            <div className="mb-4">
                <div className="p-3 text-left">
                    <span className="font-bold text-base mb-2">Chất liệu</span>
                </div>
                <div className="grid grid-cols-2">
                    {materialOptions.map((material) => (
                        <div
                            key={material.value}
                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500 ${selectedMaterials.includes(material.value) ? 'text-stone-500' : ''
                                }`}
                            onClick={() => toggleMaterial(material.value)}
                        >
                            <div className="relative">
                                <div
                                    className={`w-5 h-5 border border-gray-300 rounded flex items-center justify-center ${selectedMaterials.includes(material.value)
                                        ? 'bg-stone-500 border-stone-500'
                                        : ''
                                        }`}
                                >
                                    {selectedMaterials.includes(material.value) && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </div>
                            </div>
                            <span className="ml-2 text-xs font-medium">{material.label}</span>
                        </div>
                    ))}
                </div>
            </div>


        </aside>
    );
};

export default Filter;
