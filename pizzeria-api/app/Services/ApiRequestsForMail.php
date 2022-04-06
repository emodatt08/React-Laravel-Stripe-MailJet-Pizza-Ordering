<?php


namespace App\Services;

use App\Services\HttpClients;
use \Mailjet\Resources;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Log;

class ApiRequestsForMail{
   
    use HttpClients;

    private $url;
    private $mj;
    private $apikey;
    private $apisecret;
    public function __construct(){
        $this->url = env("MAIL_URL");
        $this->apikey = getenv('MJ_APIKEY_PUBLIC');
        $this->apisecret = getenv('MJ_APIKEY_PRIVATE');
        $this->mj = new \Mailjet\Client($this->apikey,$this->apisecret,true,['version' => 'v3.1']);
    }
    

    /**
     * Send password reset mails to users
     *
     * @param [type] $to
     * @param [type] $from
     * @param [type] $header
     * @param [type] $mesg
     * @return void
     */
    public function sendPasswordMail($to,  $name, $from, $header, $mesg){
      $body = $this->bodyOfPizzariaEmail($to,  $name, $from, $header, $mesg);
     
      //dd($body);
      $response = $this->mj->post(Resources::$Email, ['body' => $body]);
      if($response->success()){
        return $body;
      }else{
        return "false";
      }
}


/**
     * The body of the pizzaria  mail
     *
     * @return void
     */
    private function bodyOfPizzariaEmail($to, $name, $from, $header, $mesg){
      $html = view('mails.fulfilment', compact('from','to','header','name','mesg'))->__toString();
      Log::info("Mail Body: ".$html);
      $body = [
        'Messages' => [
          [
            'From' => [
              'Email' => $from,
              'Name' => $name
            ],
            'To' => [
              [
                'Email' => $to,
                'Name' => "Pizzeria"
              ]
            ],
            'Subject' => $header,
            'TextPart' => "Sadat's Pizzeria Service",
            'HTMLPart' =>  "$html",
            'CustomID' => "AppGettingStartedTest"
          ]
        ]
      ];

      return $body;
    }
}