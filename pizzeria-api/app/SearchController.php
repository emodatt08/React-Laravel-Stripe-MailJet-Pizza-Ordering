<?php

namespace App\Http\Controllers;

use App\Models\Search;
use Illuminate\Http\Request;
use App\Services\ApiRequests;
use App\Services\ApiRequestsForDocumentSearch;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{

    public function __construct(){
        $this->search = new ApiRequests();
        $this->document = new ApiRequestsForDocumentSearch();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index(Request $request, $mobile)
    {
        try {
                $request = $this->fixMobileIntoRequest($request, $mobile);

                $search = $this->search->getSwapDate($mobile);
                    Log::info('Search Request From API for: '.Auth::user()->username."<===>". json_encode($search));
               
                if(isset($search->data->statusCode) && $search->data->statusCode == 0 ){
                    $response = $this->returnResponse("sim",$search);
                }
       
                $this->create($mobile, $response, $search, "Sim Swap Date");
                
                Log::info('Search Response for: '.Auth::user()->username."<===>". json_encode($response));
                return response()->json($response, 200);

        }catch(Exception $e){
           abort(422, 'Something Went Wrong'.json_encode($e));
        } catch (ModelNotFoundException $e) { // User not found
            abort(500, 'Could not search'.json_encode($e));
        }
    }
    // public function index(Request $request, $mobile)
    // {
    //     try {
    //             $request = $this->fixMobileIntoRequest($request, $mobile);
    //             $search = $this->checkSearchID($request);
    //             $fromDB = false;

    //             if($search){
    //                 Log::info('Search Request From DB for: '.Auth::user()->username."<===>". json_encode($search));
    //                 $fromDB = true;
    //             }else{
    //                 $search = $this->search->getSwapDate($mobile);
    //                 Log::info('Search Request From API for: '.Auth::user()->username."<===>". json_encode($search));
    //             }

               
    //             if(isset($search->data->statusCode) && $search->data->statusCode == 0 && !$fromDB ){
    //                 $response = $this->returnResponse("sim",$search);
    //             }elseif(isset($search->data->statusCode) && $search->data->statusCode == "0" && $fromDB){
    //              $response = [
    //                     'responseCode'=>"200",
    //                     'responseMessage' => "success",
    //                     'data' => $search->data->data];
    //             }else{
    //                 $response = [
    //                     'responseCode'=>"404",
    //                     'responseMessage' => $search->data,
    //                     "data"=>[
    //                         "phoneNumber" => $mobile,
    //                         "lastSimSwapDate" => "NA",
    //                         "transactionId" =>"NA"
    //                     ]
    //                 ];
    //             }
                
    //             if(!$fromDB){
    //                 //insert into searches table
    //                 $this->create($mobile, $response, $search, "Sim Swap Date");
    //             }
               

    //             Log::info('Search Response for: '.Auth::user()->username."<===>". json_encode($response));
    //             return response()->json($response, 200);

    //     }catch(Exception $e){
    //        abort(422, 'Something Went Wrong'.json_encode($e));
    //     } catch (ModelNotFoundException $e) { // User not found
    //         abort(500, 'Could not search'.json_encode($e));
    //     }
    // }

    /**
     * Check if Id exists
     *
     * @param [type] $request
     * @return void
     */
    private function checkSearchID($request){
        $id = $this->getSearchId($request);
        $check = Search::where("id_number", $id)->first();
      
        if(!empty($check)){
            $jsonResponse = (isset(json_decode($check->raw_response)->body)) ? json_decode($check->raw_response)->body:false;
            $convertJsonResponse = new \stdclass();
            if($jsonResponse){
                $convertJsonResponse->data = json_decode($jsonResponse);
            }elseif(json_decode($check->raw_response)){
                $convertJsonResponse = json_decode($check->raw_response);
            }else{
                return false; 
            }
            return $convertJsonResponse;          
        }else{
            return false;
        }
    }

    /**
     * fix Id param
     *
     * @param [type] $request
     * @return void
     */
    private function getSearchId($request){
        $data = $request->all();
        $id = "";
        switch ($data) {
            case array_key_exists('pin', $data):
                $id = $data['pin'];
            break;

            case array_key_exists('tin', $data):
                $id = $data['tin'];
            break;
            case array_key_exists('id', $data):
                $id = $data['id'];
            break;

            case array_key_exists('nin_id', $data):
                $id = $data['nin_id'];
            break;
            case array_key_exists('dv_id', $data):
                $id = $data['dv_id'];
            break;

            case array_key_exists('ssnit_id', $data):
                $id = $data['ssnit_id'];
            break;

            case array_key_exists('pass_id', $data):
                $id = $data['pass_id'];
            break;

            case array_key_exists('voter_id', $data):
                $id = $data['voter_id'];
            break;

            case array_key_exists('bvn_id', $data):
                $id = $data['bvn_id'];
            break;

            case array_key_exists('phone_number', $data):
                $id = $data['phone_number'];
            break;
            case array_key_exists('mobile', $data):
                $id = $data['mobile'];
            break;
        }

        return $id;
    }
    /**
     * Fix mobile into request object
     *
     * @param [type] $request
     * @return void
     */
    private function fixMobileIntoRequest($request, $mobile){
        $request['mobile'] = $mobile;
        return $request;
    }

    private function returnResponse($type,$search){
        switch($type){
            case "sim":
                return [
                    'responseCode'=>"200",
                    'responseMessage' => (!empty($search->data->statusMessage)) ? $search->data->statusMessage: $search->statusMessage,
                    "data"=>[
                        "phoneNumber" => (!empty($search->data->phoneNumber)) ? $search->data->phoneNumber:$search->phoneNumber,
                        "lastSimSwapDate" => (!empty($search->data->data->lastSimSwapDate)) ? $search->data->data->lastSimSwapDate : "NA" ,
                        "transactionId" =>  (!empty($search->data->transactionId)) ? $search->data->transactionId:"NA",
                        "riskLevel" => (!empty($search->data->data->riskLevel)) ? $search->data->data->riskLevel:"NA",
                        "riskRecommendation" => (!empty($search->data->data->riskRecommendation)) ? $search->data->data->riskRecommendation: "NA",
                        "riskScore" => (!empty($search->data->data->riskScore)) ? $search->data->data->riskScore : "NA",
                        "blockListing" => (!empty($search->data->data->blockListing)) ? $search->data->data->blockListing : "NA",
                        "wasSimSwapPerformed" =>  (!empty($search->data->data->wasSimSwapPerformed)) ? $search->data->data->wasSimSwapPerformed : "NA"
                    ]
                ];
            break;

            default:
                
            break;
        }
       
    }

    /**
     * Search ID Documents
     *
     * @param Request $request
     * @return void
     */
    public function documents(Request $request){
            try {
                $search = $this->checkSearchID($request);
                $fromDB = false;
                //dd($search);
                if($search){
                    Log::info('Document Search Request From DB for: '.Auth::user()->username."<===>". json_encode($search));
                    $fromDB = true;
                }else{
                    $search = $this->document->validateDocument($request);
                    Log::info('Document Search Request From API for: '.Auth::user()->username."<===>". json_encode($search));
                }
                Log::info('Document Search Request for: '.Auth::user()->username."<===>". json_encode($search));
               //dd($search);
                if(isset($search)){
                    $response = [
                        'responseCode'=>"200",
                        "data"=>$search
                        
                    ]; 
                   

                }

                if(!$fromDB){
                    //insert into searches table
                    $this->create($this->getSearchId($request),$response, $search, $request->type);
                }
                Log::info('Search Response for: '.Auth::user()->username."<===>". json_encode($response));
                return response()->json($response, 200);

            }catch(Exception $e){
                abort(422, 'Something Went Wrong'.json_encode($e));
            } catch (ModelNotFoundException $e) { // User not found
                abort(500, 'Could not search'.json_encode($e));
            }
        }

    /**
     *Insert into Searches Table
     *
     * @return \Illuminate\Http\Response
     */
    public function create($id, $insert, $rawData, $type)
    {
        $insertSearch = Search::create([
            'id_number' => $id,
            'mobile' => (isset($insert['data']['phoneNumber'])) ? $insert['data']['phoneNumber']: "NA",
            'trans_id'=> (!empty($rawData->data->transactionId)) ? $rawData->data->transactionId: "", 
            'date_created'=> (!empty(Carbon::now()->toDateString())) ? Carbon::now()->toDateString() : date('Y-m-d'),
            'data_type' => $type,
            'data_response' =>(!empty($rawData->data->data->lastSimSwapDate)) ? $rawData->data->data->lastSimSwapDate : implode("|",$this->convertToReadableFormat($rawData)),
            'user_id'=>Auth::id(),'prepared_response'=>json_encode($insert),
            'raw_response'=>json_encode($rawData),
            'status'=>(isset($insert['responseCode']) && $insert['responseCode'] =="200" ) ? '1' : '0'
        ]);
    }



    private function convertToReadableFormat($rawData){
        $formatted = [];
        foreach($rawData as $key => $value){
            if(is_array($value)){
                if(count($value) > 1){
                    $formatted[] =  json_encode($value);
                }      
            }else{
                $formatted[] = $value;
            }
           
        }
        return $formatted;
    }



    /**
     * Get All Search Data
     *
     * @param Request $request
     * @return void
     */
    public function getAllSearches(Request $request){
        //dd($request->all());
       // dd(Auth::user()->roles->pluck('name'), Auth::user()->hasRole('admin'));
        $startDate = (isset($request->startdate)) ? $request->startdate : Carbon::now()->subMonth()->toDateString();
        $endDate = (isset($request->enddate)) ? $request->enddate : Carbon::now()->toDateString();
        $filters   = $request->params;
        $relationship = (isset($request->include)) ? $request->include : ["users"];

        //dd($startDate, $endDate);
        $limit     = (isset($request->limit)) ? $request->limit : 15;
        try{
            $searches = Search::whereBetween("date_created", [$startDate, $endDate])->when(!empty($filters), function($q) use($filters){

                if(array_key_exists('mobile',$filters)) {
                    $q->where('mobile', $filters['mobile']);
                    
                }
    
                if(array_key_exists('user_id',$filters)) {
                    $q->where('user_id', $filters['user_id']);
                }

                if(array_key_exists('search',$filters)) {
                    $q->where('mobile', 'like', '%' . $filters['search']. '%');
                    $q->orWhere('trans_id', 'like', '%' . $filters['search'] . '%');
                    $q->orWhere('data_response', 'like', '%' . $filters['search'] . '%');
                }
                
               
                unset($filters['search']);
    
                foreach($filters as $key => $filter){
                    $q->where($key,'LIKE',"%$filter%");
    
                }
    
                return $q;
    
    
            })->when($relationship, function($q) use($relationship){
                foreach ($relationship as $relationships){
                     $q->with($relationships);
                }
                return $q;
            })->orderby(DB::raw('created_at'),'desc')->paginate($limit);
    
    
            if($searches){
                    $response = [
                        'responseCode'=>"200",
                        'responseMessage' => "Success",
                        "data" => $searches
                    ]; 
    
                }else{
                    $response = [
                        'responseCode'=>"404",
                        'responseMessage' => "Something went wrong"
                    ];
                }
    
            return response()->json($response, 200);
        }catch(Exception $e){
            abort(422, 'Something Went Wrong'.json_encode($e));
         } catch (ModelNotFoundException $ex) { // User not found
             abort(500, 'Could not search'.json_encode($e));
         }
     


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display all searches based on roles and permissions.
     *
     * @param  \App\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function show(Search $search)
    {
      
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function edit(Search $search)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Search $search)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function destroy(Search $search)
    {
        //
    }
}
