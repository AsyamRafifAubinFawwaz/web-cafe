import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            {/* <PasskeyVerify /> */}

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-secondary/5 shadow-md">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="font-poppins font-bold text-cafe-secondary text-sm">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="rounded-xl border border-cafe-secondary/20 bg-cafe-bg/10 px-4 py-5 font-poppins focus-visible:border-cafe-primary focus-visible:ring-cafe-primary/50 text-cafe-secondary"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="font-poppins font-bold text-cafe-secondary text-sm">
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-xs text-cafe-primary hover:underline font-bold"
                                                tabIndex={5}
                                            >
                                                Forgot your password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="rounded-xl border border-cafe-secondary/20 bg-cafe-bg/10 px-4 py-5 font-poppins focus-visible:border-cafe-primary focus-visible:ring-cafe-primary/50 text-cafe-secondary"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-2.5">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-cafe-secondary/30 data-[state=checked]:bg-cafe-primary data-[state=checked]:border-cafe-primary rounded-md"
                                    />
                                    <Label htmlFor="remember" className="font-poppins text-xs font-semibold text-cafe-secondary/80 cursor-pointer selection:bg-transparent">
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-3 w-full h-12 bg-cafe-primary hover:bg-cafe-primary/90 text-white rounded-xl font-poppins font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                </Button>
                            </div>

                            {/* <div className="text-center text-xs text-cafe-secondary/60 mt-2 font-poppins">
                                Don't have an account?{' '}
                                <TextLink href={register()} className="text-cafe-primary hover:underline font-bold" tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div> */}
                        </>
                    )}
                </Form>
            </div>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600 font-poppins">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
