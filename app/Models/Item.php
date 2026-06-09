<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperItem
 */
class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category_id',
    ];

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
