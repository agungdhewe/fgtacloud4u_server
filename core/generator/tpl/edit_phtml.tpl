<div id="pnl_edit">
	<div class="fgta-page-title" style="display: flex; align-items: center ">
		<div id="pnl_edit-caption">{{STATE_BEG}}<!--__PAGETITLE__-->{{STATE_END}}</div>
		<a id="pnl_edit-btn_edit" href="javascript:void(0)" class="easyui-linkbutton fgta-button-edit" style="margin-left:10px;" data-options="plain:true,iconCls:'fgta-icon-edit'">edit</a>
	</div>


	<form id="pnl_edit-form">
<!--__FORMCOMP__-->
	</form>


	<div class="form_row" style="margin-top: 30px">
		<div class="form_label_col"></div>
		<div class="form_input_col" style="border: 0px solid black">
			<a id="pnl_edit-btn_save" class="easyui-linkbutton c1 fgta-button-save" style="width">Simpan</a>
		</div>
	</div>	


<!--__DETILPANEL__-->


	<div style="margin-top: 30px; margin-left:-5px; margin-right: -5px; background-color: #cccccc; display: flex; justify-content: space-between; padding: 10px 2px 2px 2px ">
		<div>
			<!-- letakkan tombol-tombol xtion disini -->
			<?php
			$customheaderxtion = __DIR__.'/<!--__BASENAME__-->-edit-customxtion.phtml'; 
			if (is_file($customheaderxtion)) {
				include $customheaderxtion;
			} else { ?>
			<!--__PRINTBUTTON__-->
			<!--__COMMITBUTTON__-->
			<!--__APPROVEBUTTON__-->
			<!--__XTIONBUTTONS__-->
			<?php } ?>
		</div>
		<div>
			<a id="pnl_edit-btn_delete" class="easyui-linkbutton c5 fgta-button-delete" style="margin-bottom: 10px; margin-right: 10px">Hapus</a>
		</div>
	</div>

</div>

