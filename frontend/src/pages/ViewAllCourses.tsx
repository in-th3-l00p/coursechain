import {useReadCoursesMarketplace} from "../wagmiGenerated";
import LoadingPage from '../components/LoadingPage';
import Course from '../components/dashboard/Course';
import {usePublicClient} from "wagmi";
import {PublicClient} from "viem";
import {useEffect, useState} from "react";
import courseAbi from "../abi/courseAbi.ts";
import {ChevronRight, Plus} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface ICourses {
    address: string;
    createdAt: bigint;
}

const ViewAllCourses = () => {
    const publicClient = usePublicClient() as PublicClient | undefined;
    const {data: coursesAddress, isPending} = useReadCoursesMarketplace({
        functionName: "getAllCourses"
    });
    const [courses, setCourses] = useState<ICourses[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!coursesAddress || !publicClient) return;
        const fetchCourses = async () => {
            let courses = await Promise.all(
                coursesAddress.map(async (address: string) => {
                    // @ts-ignore
                    const createdAt = await publicClient.readContract({
                        address: address,
                        abi: courseAbi,
                        functionName: "createdAt",
                    });
                    return {address, createdAt};
                })
            );
            courses = courses.sort((a, b) => Number(b.createdAt - a.createdAt));
            setCourses(courses);
        };
        fetchCourses().then(() => {});
    }, [coursesAddress, publicClient]);

    if (courses === null || isPending) return <LoadingPage/>

    return (
        <div className="min-h-screen pt-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li>
                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center text-gray-400 hover:text-white"
                                >
                                    Dashboard
                                </button>
                            </div>
                        </li>
                        <ChevronRight className="flex items-center text-gray-400 hover:text-white"/>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <span className="text-gray-400 hover:text-white">Courses</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">All Courses</h1>
                    <a
                        href={"/courses/create"}
                        className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2"/>
                        Create New Course
                    </a>
                </div>

                <div className="space-y-4">
                    {courses.map((course, index) => (
                        <Course key={index} address={course.address} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewAllCourses;
