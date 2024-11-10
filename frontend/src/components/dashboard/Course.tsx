import { useReadContract } from "wagmi";
import courseAbi from "../../abi/courseAbi";
import { DollarSign, Settings } from "lucide-react";
import { formatEther } from "viem";

interface CourseDto {
    title: string;
    slug: string;
    description: string;
    category: string;
    price: bigint; // Assuming price is returned as uint256
}

interface CourseProps {
    address: string;
}

export default function Course({ address }: CourseProps) {
    const { data, isLoading, error } = useReadContract({
        address: address as `0x${string}`,
        abi: courseAbi,
        functionName: "get",
    });

    // Type assertion to CourseDto
    const course = data as CourseDto | undefined;

    if (error)
        return (
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative"
                role="alert"
            >
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline">
                    {error.message || "An unexpected error occurred."}
                </span>
            </div>
        );

    if (isLoading)
        return (
            <div className="bg-gray-700/50 rounded-lg p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-3 w-full">
                        {/* Title and Category Skeleton */}
                        <div className="flex items-center space-x-2">
                            <div className="h-6 bg-gray-500 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-500 rounded-full w-24"></div>
                        </div>
                        {/* Description Skeleton */}
                        <div className="h-4 bg-gray-500 rounded w-full"></div>
                        {/* Price Skeleton */}
                        <div className="flex items-center text-sm text-gray-400 space-x-2">
                            <div className="w-4 h-4 bg-gray-500 rounded"></div>
                            <div className="w-16 h-4 bg-gray-500 rounded"></div>
                        </div>
                    </div>
                    {/* Settings Button Skeleton */}
                    <div className="w-5 h-5 bg-gray-500 rounded"></div>
                </div>
            </div>
        );

    return (
        <div className="bg-gray-700/50 rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                    {/* Title and Category */}
                    <div className="flex items-center space-x-2">
                        {/* Course Title */}
                        <h3 className="font-semibold text-lg">{course?.title}</h3>

                        {/* Category as a Pill-Style Tag */}
                        <span className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                            {course?.category}
                        </span>
                    </div>

                    {/* Course Description */}
                    <p className="text-gray-300 text-sm">
                        {course?.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center text-sm text-gray-400">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{formatEther(course?.price || 0n)} ETH</span>
                    </div>
                </div>

                {/* Settings Button */}
                <button className="text-indigo-400 hover:text-indigo-300 p-1">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
