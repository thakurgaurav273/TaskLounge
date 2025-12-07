import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from '../app/slices/appSlice';
import Logo from "../assets/logo_light.svg"
const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [canLogin, setCanLogin] = useState<boolean>(false);
    const dispatch = useDispatch();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const history = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: formData.password,
                email: formData.email
            })
        }).then((data)=> data.json());

        console.log(response);
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            dispatch(setLoggedInUser(response.user));
            setCanLogin(true);
        }
        setTimeout(() => {
            setCanLogin(false)
        }, 500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa]">
            {canLogin && (
                <div className='flex bg-[green] gap-[10px] p-[10px] transition-opacity duration-[150ms] rounded-[8px] items-center text-[white] fixed right-[4px] top-[20px]'>
                    <CheckCircle />
                    Logged-In, you will be redirected to home!
                </div>
            )}
            <div className="w-full max-w-[440px] p-[24px]">
                <div className="mb-[48px] text-center">
                    <div className='w-full flex items-center justify-center'>
                    <img src={Logo} height={50} width={280}/>
                    </div>
                    <h1 className="text-[32px] font-semibold text-[#1a1a1a] mb-[8px]">
                        Welcome back
                    </h1>
                    <p className="text-[14px] text-[#6b7280]">
                        Sign in to your account to continue
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-[#ffffff] rounded-[12px] border-[1px] border-[#e5e7eb] p-[32px] shadow-sm flex flex-col gap-[20px]"
                >
                    <div className="flex flex-col gap-[8px]">
                        <label htmlFor="email" className="text-[13px] font-medium text-[#1a1a1a]">
                            Email or Username
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-[12px] top-[50%] translate-y-[-50%] text-[#6b7280]" size={18} />
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com or @johndoe"
                                className="w-full bg-[#fafafa] border-[1px] border-[#e5e7eb] rounded-[8px] px-[40px] py-[12px] text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:bg-[#ffffff] transition-all"
                                autoComplete="username"
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
                                placeholder="••••••••"
                                className="w-full bg-[#fafafa] border-[1px] border-[#e5e7eb] rounded-[8px] px-[40px] py-[12px] text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#5e6ad2] focus:bg-[#ffffff] transition-all"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-[13px] bg-[transparent] border-[0] text-[#5e6ad2] hover:text-[#4f5bc4] transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"  
                        className="w-full border-[0] bg-[#5e6ad2] hover:bg-[#4f5bc4] text-[#ffffff] font-medium text-[14px] py-[12px] px-[24px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all mt-[8px]"
                    >
                        Sign in
                        <ArrowRight size={16} />
                    </button>
                </form>

                <div className="flex items-center gap-[16px] my-[24px]">
                    <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
                    <span className="text-[12px] text-[#6b7280]">OR</span>
                    <div className="flex-1 h-[1px] bg-[#e5e7eb]" />
                </div>

                <div className="text-center">
                    <span className="text-[14px] text-[#6b7280]">
                        Don't have an account?
                    </span>{' '}
                    <p
                        className="text-[14px] text-[#5e6ad2] hover:text-[#4f5bc4] font-medium transition-colors"
                        onClick={() => {
                            history('/signup')
                        }}
                    >
                        Sign up
                    </p>
                </div>
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

export default LoginPage;
