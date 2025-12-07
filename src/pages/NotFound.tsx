import { Home, ArrowLeft, Search } from 'lucide-react';

const PageNotFound = () => {
    const handleGoHome = () => {
        console.log('Navigating to home...');
        window.location.href = '/';
    };

    const handleGoBack = () => {
        console.log('Going back...');
        window.history.back();
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa]">
            <div className="max-w-[600px] w-full p-[24px] text-center">
                {/* 404 Illustration */}
                <div className="mb-[32px]">
                    <div className="relative inline-block">
                        <div className="text-[120px] font-bold text-[#e5e7eb] select-none">
                            404
                        </div>
                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                            <Search className="text-[#6b7280]" size={48} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-[40px]">
                    <h1 className="text-[32px] font-semibold text-[#1a1a1a] mb-[12px]">
                        Page not found
                    </h1>
                    <p className="text-[16px] text-[#6b7280] leading-[24px]">
                        The page you're looking for doesn't exist or has been moved.
                        <br />
                        Please check the URL or return to the homepage.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-[12px] items-center justify-center">
                    <button
                        onClick={handleGoHome}
                        className="w-full border-[0] max-w-[280px] bg-[#5e6ad2] hover:bg-[#4f5bc4] text-[#ffffff] font-medium text-[14px] py-[12px] px-[24px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all"
                    >
                        <Home size={16} />
                        Go to Homepage
                    </button>
                    
                    <button
                        onClick={handleGoBack}
                        className="w-full max-w-[280px] bg-[#ffffff] hover:bg-[#f5f5f5] text-[#1a1a1a] font-medium text-[14px] py-[12px] px-[24px] rounded-[8px] border-[1px] border-[#e5e7eb] flex items-center justify-center gap-[8px] transition-all"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>

                <div className="mt-[48px] pt-[32px] border-t-[1px] border-[#e5e7eb]">
                    <p className="text-[13px] font-medium text-[#6b7280] mb-[16px]">
                        You might be looking for:
                    </p>
                    <div className="flex flex-wrap gap-[8px] justify-center">
                        <a
                            href="#"
                            className="px-[16px] py-[8px] bg-[#ffffff] border-[1px] border-[#e5e7eb] rounded-[6px] text-[13px] text-[#1a1a1a] hover:border-[#5e6ad2] hover:text-[#5e6ad2] transition-all"
                        >
                            Home
                        </a>
                        <a
                            href="/login"
                            className="px-[16px] py-[8px] bg-[#ffffff] border-[1px] border-[#e5e7eb] rounded-[6px] text-[13px] text-[#1a1a1a] hover:border-[#5e6ad2] hover:text-[#5e6ad2] transition-all"
                        >
                            Login
                        </a>
                        <a
                            href="/signup"
                            className="px-[16px] py-[8px] bg-[#ffffff] border-[1px] border-[#e5e7eb] rounded-[6px] text-[13px] text-[#1a1a1a] hover:border-[#5e6ad2] hover:text-[#5e6ad2] transition-all"
                        >
                            Signup
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;