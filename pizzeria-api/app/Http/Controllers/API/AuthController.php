<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\CentreController;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthController extends CentreController
{
    public function login(Request $request)
    {
        $authUser = User::where('first_name',$request->first_name)->first(); 
        
        if(empty($authUser)){
            return $this->returnErrorResponse('User doesnt exist.', [], 200);
        }

        $checkHash = Hash::check($request->password, $authUser->password);
    
        if($checkHash){ 
            
            $success['token'] =  $authUser->createToken('PizzeriaAuthApp')->plainTextToken; 
            $success['name'] =  $authUser->name;
   
            return $this->returnSuccessResponse($success, 'User signed in');
        }
        else{ 
            return $this->returnErrorResponse('Unauthorised.', ['error'=>'Unauthorised'], 200);
        } 
    }

    public function register(Request $request)
    {
        try {
            $user = new User();
            $user->first_name = $request->first_name;
            $user->password = Hash::make($request->password);
            $user->save();

            $success['status'] = true;
            $success['message'] = 'Admin registered successfully';
            return $this->returnSuccessResponse($success, 'User signed in');
        } catch (\Illuminate\Database\QueryException $ex) {
            $success['status'] = false;
            $success['message'] = $ex->getMessage();
        }

        // response
        $response = [
            'success' => $success,
            'message' => $message ?? "",
        ];
        return $this->returnErrorResponse($response, ['error'=>'Unauthorised'], 200);
    }


    public function logout()
    {
        try {
            Session::flush();
            $success['status'] = true;
            $message['message'] = 'Successfully logged out';
            return $this->returnSuccessResponse($success, '');
        } catch (\Illuminate\Database\QueryException $ex) {
            $success = false;
            $success['message'] = $ex->getMessage();
        }

        // response
        $response = [
            'success' => $success,
            'message' => $message,
        ];
        return response()->json($response);
    }


}
