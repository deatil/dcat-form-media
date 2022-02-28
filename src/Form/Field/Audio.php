<?php

namespace Lake\FormMedia\Form\Field;

use Lake\FormMedia\Form\Field;

/**
 * 表单音频字段
 *
 * @create 2020-11-30
 * @author deatil
 */
class Audio extends Field
{
    protected $limit = 1;
    
    protected $remove = true;
    
    protected $type = 'audio';
}
