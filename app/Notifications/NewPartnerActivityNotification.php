<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class NewPartnerActivityNotification extends Notification
{
    public function __construct(
        public string $activityType,
        public string $title,
        public string $message,
        public string $reference,
        public string $url,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'activity_type' => $this->activityType,
            'title' => $this->title,
            'message' => $this->message,
            'reference' => $this->reference,
            'url' => $this->url,
        ];
    }
}
