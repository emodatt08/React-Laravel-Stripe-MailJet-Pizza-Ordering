<?php

namespace App\Jobs;

use App\Services\ApiRequestsForMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendFulfilmentEmailJob implements ShouldQueue
{
    private $pizza;
    private $mail;
    private $email;
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($pizza, $email)
    {
        $this->pizza = $pizza;
        $this->mail = new ApiRequestsForMail();
        $this->email = $email;
        Log::info("email: ".json_encode($this->email). " Link: ". $this->pizza);
        
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //

        if(!empty($this->pizza->decline_note)){
            Log::info("Order Declined email handle Request-----". "email: ".json_encode($this->email). " pizza : ". json_encode($this->pizza));
            $send =  $this->mail->sendPasswordMail($this->email, "Decline", "emodatt08@gmail.com", "Pizza Order declined",  $this->pizza);
            Log::info("Order Declined email handle  Response----". "mail html: ".json_encode($send));
        }else{
            Log::info("Order Fulfillment email handle Request-----". "email: ".json_encode($this->email). " pizza : ". json_encode($this->pizza));
            $send =  $this->mail->sendPasswordMail($this->email, "Fulfilment", "emodatt08@gmail.com", "Pizza Order Fulfilment",  $this->pizza);
            Log::info("Order Fulfillment email handle  Response----". "mail html: ".json_encode($send));
        }
    }
}
