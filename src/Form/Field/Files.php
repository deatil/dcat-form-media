<?php

namespace Lake\FormMedia\Form\Field;

use Lake\FormMedia\Form\Field;

/**
 * 表单文件字段
 *
 * @create 2020-11-30
 * @author deatil
 */
class Files extends Field
{
    protected $limit = 5;
    
    protected $remove = true;
    
    protected $type = 'blend';
}
