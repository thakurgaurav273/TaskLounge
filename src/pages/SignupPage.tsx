import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const [canLogin, setCanLogin] = useState<boolean>(false);
    const history = useNavigate();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('Signup:', formData);
        const response = await fetch('http://localhost:8080/api/users/create', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                username: formData.username,
                password: formData.password,
                email: formData.email
            })
        })
        if (response.ok) {
            setCanLogin(true);
        }
        setTimeout(() => {
            setCanLogin(false)
            history('/login');
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa]">
            {canLogin && (
                <div className='flex bg-[green] gap-[10px] p-[10px] transition-opacity duration-[150ms] rounded-[8px] items-center text-[white] fixed right-[4px] top-[20px]'>
                    <CheckCircle />
                    Signed Up, you will be redirected to login!
                </div>
            )}
            <div className="w-full max-w-[440px] p-[24px]">
                <div className="mb-[48px] text-center">
                    <h1 className="text-[32px] font-semibold text-[#1a1a1a] mb-[8px]">
                        Create your account
                    </h1>
                    <p className="text-[14px] text-[#6b7280]">
                        Start your journey with us today
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-[#ffffff] rounded-[12px] border-[1px] border-[#e5e7eb] p-[32px] shadow-sm">
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex flex-col gap-[8px]">
                                <label htmlFor="name" className="text-[13px] font-medium text-[#1a1a1a]">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-[12px] top-[50%] translate-y-[-50%] text-[#6b7280]" size={18} />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full bg-[#fafafa] border-[1px] border-[#e5e7eb] rounded-[8px] px-[40px] py-[12px] text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:bg-[#ffffff] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-[8px]">
                                <label htmlFor="username" className="text-[13px] font-medium text-[#1a1a1a]">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute left-[12px] top-[50%] translate-y-[-50%] text-[#6b7280] text-[14px] font-medium">@</span>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="johndoe"
                                        autoComplete='username'
                                        className="w-full bg-[#fafafa] border-[1px] border-[#e5e7eb] rounded-[8px] px-[40px] py-[12px] text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:bg-[#ffffff] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-[8px]">
                                <label htmlFor="email" className="text-[13px] font-medium text-[#1a1a1a]">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-[12px] top-[50%] translate-y-[-50%] text-[#6b7280]" size={18} />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        autoComplete='email'
                                        placeholder="john@example.com"
                                        className="w-full bg-[#fafafa] border-[1px] border-[#e5e7eb] rounded-[8px] px-[40px] py-[12px] text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:bg-[#ffffff] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-[8px]">
                                <label htmlFor="password" className="text-[13px] font-medium text-[#1a1a1a]">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-[12px] top-[50%] translate-y-[-50%] text-[#6b7280]" size={18} />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete='current-password'
                                        placeholder="••••••••"
                                        className="w-full bg-[#fafafa] border-[1px] border-[#e5e7eb] rounded-[8px] px-[40px] py-[12px] text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:bg-[#ffffff] transition-all"
                                    />
                                </div>
                                <p className="text-[12px] text-[#6b7280] mt-[4px]">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            <button
                                type='submit'
                                className="w-full bg-[#5e6ad2] border-[0] hover:bg-[#4f5bc4] text-[#ffffff] font-medium text-[14px] py-[12px] px-[24px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all mt-[8px]"
                            >
                                Create account
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-[16px] my-[24px]">
                            <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                            <span className="text-[12px] text-[#6b7280]">OR</span>
                            <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                        </div>

                        <div className="text-center">
                            <span className="text-[14px] text-[#6b7280]">
                                Already have an account?
                            </span>
                            {' '}
                            <a
                                href="#"
                                className="text-[14px] text-[#5e6ad2] hover:text-[#4f5bc4] font-medium transition-colors"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-[32px] text-center">
                    <p className="text-[12px] text-[#6b7280]">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-[#4b5563] hover:text-[#1a1a1a] underline">
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#" className="text-[#4b5563] hover:text-[#1a1a1a] underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;