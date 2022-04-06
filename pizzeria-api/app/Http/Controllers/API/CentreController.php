<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;

class CentreController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function returnSuccessResponse($result, $message)
    {
    	$response = [
            'responseCode' => '200',
            'responseMessage' => $message,
            'data'    => $result
            
        ];
        return response()->json($response, 200);
    }

    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public function returnErrorResponse($error, $errorMessages = [], $code = 404)
    {
    	$response = [
            'responseCode' => '400',
            'responseMessage' => $error,
        ];
        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }
        return response()->json($response, $code);
    }
}
