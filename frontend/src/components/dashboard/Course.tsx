import { useReadContract } from "wagmi";
import courseAbi from "../../abi/courseAbi";
import { DollarSign, Settings, Users } from "lucide-react";

export default function Course({ address }: { address: string }) {
    const { data: course, isPending, error } = useReadContract({
        address: address as `0x${string}`,
        abi: courseAbi,
        functionName: "getTitle"
    })
    console.log(address, course, isPending);

    if (error)
        return (
            <div>
                {/* skeleton that shows that an error occurred */}
            </div>
        );
    if (isPending)
        return (
            <div>
                {/* plese create me a skeleton of the component here */}
            </div>
        )
    return (
        <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-semibold mb-1">{course.title}</h3>
                <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                {course.students} students
                <span className="mx-2">•</span>
                <DollarSign className="w-4 h-4 mr-1" />
                {course.revenue}
                </div>
            </div>
            <button className="text-indigo-400 hover:text-indigo-300">
                <Settings className="w-5 h-5" />
            </button>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
            <div
                className="bg-indigo-500 rounded-full h-2"
                style={{ width: `${course.progress}%` }}
            />
            </div>
        </div>
    );
}