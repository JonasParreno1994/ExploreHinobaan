<?php

namespace App;

enum EnterpriseWebsiteTemplate: string
{
    case Tropical = 'tropical';
    case Coastal = 'coastal';
    case Modern = 'modern';
    case Elegant = 'elegant';
    case Nature = 'nature';
    case Minimal = 'minimal';
    case LocalHeritage = 'local_heritage';

    public function label(): string
    {
        return match ($this) {
            self::Tropical => 'Tropical', self::Coastal => 'Coastal', self::Modern => 'Modern',
            self::Elegant => 'Elegant', self::Nature => 'Nature', self::Minimal => 'Minimal',
            self::LocalHeritage => 'Local Heritage',
        };
    }
}
