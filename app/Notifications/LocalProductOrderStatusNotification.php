<?php

namespace App\Notifications;

use App\Models\LocalProductOrder;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LocalProductOrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public LocalProductOrder $order)
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
        $this->order->loadMissing(['enterprise:id,business_name', 'items']);

        return (new MailMessage)
            ->subject('Product Order '.str($this->order->status)->headline().' · '.$this->order->order_number)
            ->markdown('mail.local-product-orders.status', ['order' => $this->order, 'url' => route('local-product-orders.success', $this->order->order_number)]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        $this->order->loadMissing('enterprise:id,business_name');
        $status = str($this->order->status)->replace('_', ' ')->headline()->toString();

        return [
            'activity_type' => 'product_order',
            'title' => "Product Order {$status}",
            'message' => "{$this->order->enterprise->business_name} updated your order to {$status}.",
            'reference' => $this->order->order_number,
            'url' => route('local-product-orders.success', $this->order->order_number),
        ];
    }
}
