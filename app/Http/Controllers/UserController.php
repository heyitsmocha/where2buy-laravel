<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        $responseJson = ['message' => 'User registered successfully', 'user' => $user];

        // Generate token for mobile app to log them in immediately after registration
        if ($this->usesToken($request)) {
            $token = $user->createToken($request->input('device_name'))->plainTextToken;
            $responseJson['token'] = $token;
        }

        return response()->json($responseJson, 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required|string|max:255',
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $responseJson = [
            'email' => $user->email,
            'name' => $user->name,
        ];

        // Generate token if request is from a mobile app
        if ($this->usesToken($request)) {
            $token = $user->createToken($request->input('device_name'))->plainTextToken;
            $responseJson['token'] = $token;
        }

        return response()->json($responseJson);
    }

    public function webLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            // Regenerate session to prevent session fixation attacks
            $request->session()->regenerate();

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        // $request->user()->tokens()->where('id', $request->input('device_name'))->delete();
        if ($this->usesToken($request)) {
            $token = $request->user()->currentAccessToken();
            if ($token instanceof PersonalAccessToken) { // Type check to stop visual studio code from complaining about delete() method
                $token->delete();
            }
        } else {
            $request->user()->logout(); // For session-based authentication (e.g. web)
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Helper method to determine if the request needs to use token authentication (e.g. mobile app, possibly SPA in the future).
     * Checks for a custom header 'X-Platform' with value 'mobile-flutter' to identify requests from the mobile app.
     */
    private function usesToken(Request $request)
    {
        $platform = $request->header('X-Platform');
        return $platform && $platform === 'mobile-flutter';
    }
}
