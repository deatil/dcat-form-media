<?php

namespace Lake\FormMedia\Form\Field;

use Lake\FormMedia\Form\Field;

class Photo extends Field
{
    protected $limit = 1;
    protected $remove = true;
    protected $type = 'img';
}
