<?php

namespace App\Notifications;

use App\Models\TouristVerification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TouristVerificationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public TouristVerification $verification) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = str($this->verification->verification_status)->replace('_', ' ')->headline();

        return (new MailMessage)
            ->subject('Tourist identity verification: '.$status)
            ->greeting('Hello '.$notifiable->name.'.')
            ->line($this->verification->verification_status === 'verified' ? 'Your Explore Hinoba-an Tourist Account has been verified successfully.' : 'Your tourist identity verification requires attention.')
            ->when($this->verification->rejection_reason, fn (MailMessage $message) => $message->line('Reason: '.$this->verification->rejection_reason))
            ->action('View Verification', route('tourist.verification.show'))
            ->line('Tourism enterprises can only see your verification status and cannot access your uploaded documents.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return ['title' => 'Identity verification updated', 'status' => $this->verification->verification_status, 'message' => $this->verification->rejection_reason];
    }
}
