<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class ReservationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $this->reservation->loadMissing(['enterprise:id,business_name', 'items.service:id,name', 'items.session:id,name,start_time,end_time']);
        $statusLabel = match ($this->reservation->status) {
            'confirmed' => 'Reservation Confirmed',
            'rejected' => 'Reservation Rejected',
            'cancelled' => 'Reservation Cancelled',
            'completed' => 'Reservation Completed',
            default => 'Reservation Received',
        };
        $intro = match ($this->reservation->status) {
            'confirmed' => 'Your tourism enterprise has approved your reservation.',
            'rejected' => 'Your tourism enterprise was unable to approve your reservation.',
            'cancelled' => 'Your reservation has been cancelled.',
            'completed' => 'Your reservation has been marked as completed. Thank you for visiting Hinoba-an.',
            default => 'Your request was received and is pending confirmation from the tourism enterprise.',
        };
        $statusUrl = URL::temporarySignedRoute('reservations.status.show', now()->addDays(30), ['reservation' => $this->reservation]);

        return (new MailMessage)
            ->subject($statusLabel.' · '.$this->reservation->reservation_number)
            ->markdown('mail.reservations.status', [
                'reservation' => $this->reservation,
                'statusLabel' => $statusLabel,
                'intro' => $intro,
                'statusUrl' => $statusUrl,
            ]);
    }
}
