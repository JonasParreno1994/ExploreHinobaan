<?php

namespace App\Notifications;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationPaymentStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Reservation $reservation)
    {
        $this->afterCommit();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return $notifiable instanceof User ? ['mail', 'database'] : ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = str($this->reservation->payment_status)->headline()->toString();

        return (new MailMessage)
            ->subject("Reservation payment {$status} · {$this->reservation->reservation_number}")
            ->greeting("Hello {$this->reservation->customer_name}.")
            ->line("Your reservation fee payment was marked as {$status}.")
            ->action('View Reservation', route('tourist.reservations.show', $this->reservation));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $status = str($this->reservation->payment_status)->headline()->toString();

        return [
            'activity_type' => 'payment',
            'title' => "Reservation Payment {$status}",
            'message' => "Your reservation fee payment was marked as {$status}.",
            'reference' => $this->reservation->reservation_number,
            'url' => route('tourist.reservations.show', $this->reservation),
        ];
    }
}
