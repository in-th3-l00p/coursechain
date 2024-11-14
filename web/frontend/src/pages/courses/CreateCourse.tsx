import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    BookOpen,
    DollarSign,
    Plus,
    ChevronRight,
    Settings,
} from 'lucide-react';
import {useEthRate} from '../../hook/useEthRate.ts';
import {
    useReadCoursesMarketplacePrice,
    useWriteCoursesMarketplacePurchaseCourse
} from '../../wagmiGenerated.ts';
import {formatEther, parseEther} from 'viem';
import LoadingPage from '../../components/LoadingPage.tsx';

const showCourseCreationPrice = (courseCreationPrice: bigint | undefined): string => {
    if (courseCreationPrice === undefined)
        return 'loading...';
    return formatEther(courseCreationPrice);
}

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        slug: '', // Add slug field
        description: '',
        category: '',
        price: '',
        image: null as File | null,
    });

    // state related to pricing
    const {
        isLoading: ethRateLoading,
        error,
        calculateEthToEur,
    } = useEthRate();
    const {
        data: courseCreationPrice,
        isPending: courseCreationPriceLoading
    } = useReadCoursesMarketplacePrice();

    // writing the course
    const {
        writeContractAsync,
        isPending: writeContractLoading
    } = useWriteCoursesMarketplacePurchaseCourse();
    const [transactionLoading, setTransactionLoading] = useState(false);

    // global loading variable
    const loading = ethRateLoading || courseCreationPriceLoading || writeContractLoading || transactionLoading;

    /**
     * Handles changes to form inputs.
     * @param e React change event
     */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    /**
     * Handles form submission.
     * @param e React form event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionLoading(true);
        writeContractAsync({
            args: [
                formData.title,
                formData.slug,
                formData.description,
                formData.category,
                parseEther(formData.price)
            ],
            value: courseCreationPrice
        })
            .then(() => navigate(`/dashboard?courseCreated`))
            .catch(error => console.error(error))
            .finally(() => setTransactionLoading(false));
    };

    if (transactionLoading)
        return <LoadingPage/>
    return (
        <div className="min-h-screen pt-16 bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb Navigation */}
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
                        <li>
                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="flex items-center text-gray-400 hover:text-white"
                                >
                                    Courses
                                </button>
                            </div>
                        </li>

                        <ChevronRight className="flex items-center text-gray-400 hover:text-white"/>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <span className="text-gray-400 hover:text-white">Create New Course</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Create New Course</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    {/* Course Title */}
                    <div className="mb-6">
                        <label
                            htmlFor="title"
                            className="block text-gray-400 text-sm font-medium mb-2"
                        >
                            Course Title
                        </label>
                        <div className="flex items-center bg-gray-700 rounded-lg px-4 py-2">
                            <BookOpen className="w-5 h-5 text-gray-400 mr-2"/>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500"
                                placeholder="Enter course title"
                            />
                        </div>
                    </div>

                    {/* Slug */}
                    <div className="mb-6">
                        <label
                            htmlFor="slug"
                            className="block text-gray-400 text-sm font-medium mb-2"
                        >
                            Slug
                        </label>
                        <div className="flex items-center bg-gray-700 rounded-lg px-4 py-2">
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500"
                                placeholder="Enter course slug"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label
                            htmlFor="description"
                            className="block text-gray-400 text-sm font-medium mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-gray-700 text-white rounded-lg p-4 focus:outline-none placeholder-gray-500"
                            placeholder="Enter course description"
                        ></textarea>
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label
                            htmlFor="category"
                            className="block text-gray-400 text-sm font-medium mb-2"
                        >
                            Category
                        </label>

                        <div className="flex items-center bg-gray-700 rounded-lg px-4 py-2">
                            <Settings className="w-5 h-5 text-gray-400 mr-2"/>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500"
                                placeholder="e.g., Development, Security"
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <label
                            htmlFor="price"
                            className="block text-gray-400 text-sm font-medium mb-2"
                        >
                            Price (ETH)
                        </label>
                        <div className="flex items-center bg-gray-700 rounded-lg px-4 py-2">
                            <DollarSign className="w-5 h-5 text-gray-400 mr-2"/>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.000001"
                                className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500"
                                placeholder="Enter course price in ETH"
                            />
                        </div>
                        {/* Display EUR Equivalent for Course Price */}
                        <div className="mt-2 text-gray-400 text-sm">
                            {courseCreationPriceLoading && <span>Fetching current ETH price...</span>}
                            {error && <span className="text-red-500">Error: {error}</span>}
                            {!courseCreationPriceLoading && !error && formData.price && (
                                <span>≈ €{calculateEthToEur(parseFloat(formData.price))} EUR</span>
                            )}
                        </div>
                    </div>

                    {/* Course Creation Fee */}
                    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                        <h2 className="text-gray-300 text-sm font-medium mb-2">Course Creation Fee</h2>
                        <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-gray-400 mr-2"/>
                            <span
                                className="text-gray-400">Fixed Fee: {showCourseCreationPrice(courseCreationPrice)} ETH</span>
                        </div>
                        <div className="mt-1 flex items-center">
                            <DollarSign className="w-5 h-5 text-gray-400 mr-2"/>
                            {courseCreationPriceLoading && <span>Fetching fee in EUR...</span>}
                            {error && <span className="text-red-500">Error: {error}</span>}
                            {!courseCreationPriceLoading && !error && (
                                <span>≈ €{calculateEthToEur(Number.parseFloat(showCourseCreationPrice(courseCreationPrice)))} EUR</span>
                            )}
                        </div>
                        <p className="mt-2 text-gray-400 text-sm">
                            A fixed fee of <strong>{showCourseCreationPrice(courseCreationPrice)} ETH</strong>
                            is required to create a course on the platform.
                        </p>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="mb-6">
                        <input
                            type="checkbox"
                            id="confirm"
                            required
                            className="mr-2"
                        />
                        <label
                            htmlFor="confirm"
                            className="text-gray-400 text-sm"
                        >
                            I confirm that all information provided is accurate and complies with the terms and
                            conditions.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-white font-semibold disabled:opacity-50"
                            disabled={loading}
                        >
                            <Plus className="w-5 h-5 mr-2"/>
                            Create Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
