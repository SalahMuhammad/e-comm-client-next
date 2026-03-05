const TimeLineRangeSlider = ({ value, timeWindowSize, min, max, onChange, className = "", trackColor = "bg-indigo-500", showProgress = false, progressStart = 0, progressEnd = 100 }) => {
    const value2 = value ?? timeWindowSize
    const percentage = ((value2 - min) / (max - min)) * 100;
    return (

        <div>

            <div className={`flex items-center justify-between text-xs text-gray-400 mb-2 ${showProgress ? 'text-xs text-gray-400' : ''}`}>
                {showProgress ? (
                    <>
                        <span>Start: {Math.round(value2)}%</span>
                        <span>End: {Math.round(value2 + timeWindowSize)}%</span>
                    </>
                ) : (
                    <>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Window Size</span>
                        <span className="text-xs text-gray-500">{Math.round(timeWindowSize)}%</span>
                    </>
                )}
            </div>

            <div className={`relative ${className}`}>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-auto">
                    {showProgress ? (
                        <div
                            className="absolute h-full rounded-full transition-all duration-300"
                            style={{
                                left: `${progressStart}%`,
                                width: `${progressEnd - progressStart}%`,
                                background:
                                    "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)",
                            }}
                        />
                    ) : (
                        <div
                            className={`absolute h-full rounded-full transition-all duration-300 ${trackColor}`}
                            style={{ width: `${percentage}%` }}
                        />
                    )}
                </div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value2}
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="range"
                />

                <div
                    className="absolute top-1/2 w-4 h-4 md:w-6 md:h-6 bg-white border-2 md:border-4 border-indigo-500 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 transition-all duration-200"
                    style={{ left: `${percentage}%` }}
                    aria-hidden
                />
            </div>

            {!showProgress && (
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10%</span>
                    <span>{Math.round(timeWindowSize)}%</span>
                    <span>100%</span>
                </div>
            )}
        </div>
    );
};

export default TimeLineRangeSlider
