<?php

namespace App\Helpers;

use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

/**
 * Qr-code Helper – QR kód generálás segédosztály.
 */

class QrHelper
{
    /**
     * SVG formátumú QR kód generálása.
     * @param string $data A QR kódba kódolandó adat
     * @param int $size A QR kód mérete (pixel)
     * @return string SVG kód
     */
    public static function generateSvg(string $data, int $size = 200): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        return $writer->writeString($data);
    }
}