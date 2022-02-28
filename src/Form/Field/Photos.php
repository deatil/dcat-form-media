<?php

namespace Lake\FormMedia\Form\Field;

use Lake\FormMedia\Form\Field;

/**
 * 表单多图字段
 *
 * @create 2020-11-25
 * @author deatil
 */
class Photos extends Field
{
    protected $limit = 9;
    
    protected $remove = true;
    
    protected $type = 'image';
}
