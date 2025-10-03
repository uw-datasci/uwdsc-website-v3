'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterTestPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                // Check if user has a session (email confirmed) or not
                if (data.session) {
                    // User has session, check if email is confirmed
                    if (data.user.email_confirmed_at) {
                        router.push('/me');
                    } else {
                        router.push('/verify-email');
                    }
                } else {
                    // No session means email confirmation required
                    router.push('/verify-email');
                }
            } else {
                setResponse(`Status: ${res.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
            }
        } catch (error) {
            setResponse(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Register API Test</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Register'}
                </button>
            </form>

            {response && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Response:</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {response}
                    </pre>
                </div>
            )}
        </div>
    );
}