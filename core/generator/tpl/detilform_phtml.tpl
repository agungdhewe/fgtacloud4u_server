<div id="<!--__PANELNAME__-->">
	<div class="fgta-page-title" style="display: flex; align-items: center ">
		<div id="<!--__PANELNAME__-->-caption">{{STATE_BEG}}<!--__PAGETITLE__-->{{STATE_END}}</div>
		<a id="<!--__PANELNAME__-->-btn_edit" href="javascript:void(0)" class="easyui-linkbutton fgta-button-edit" style="margin-left:10px;" data-options="plain:true,iconCls:'fgta-icon-edit'">edit</a>
	</div>
	<div id="<!--__PANELNAME__-->-title" class="fgta-page-subtitle">XXXXXXX</div>


	<form id="<!--__PANELNAME__-->-form">
<!--__FORMCOMP__-->
	</form>


	<div class="form_row" style="margin-top: 30px">
		<div class="form_label_col"></div>
		<div class="form_input_col" style="border: 0px solid black">
			<div style="margin-bottom: 10px">
				<input id="<!--__PANELNAME__-->-autoadd" type="checkbox"><label for="<!--__PANELNAME__-->-autoadd">Otomatis tambah baru setelah berhasil disimpan</label>
			</div>
			<div>
				<a id="<!--__PANELNAME__-->-btn_save" class="easyui-linkbutton c1 fgta-button-save" style="width: 100px">Simpan</a>
			</div>
		</div>
	</div>	


	<?php
	$custombuttonbar = __DIR__.'/<!--__CUSTOMBUTTONBAR__-->';
	if (is_file($custombuttonbar)) {
		include $custombuttonbar;
	} else { ?>
	<div id="<!--__PANELNAME__-->-buttonbar" style="margin-top: 30px; margin-left:-5px; margin-right: -5px; background-color: #cccccc; height: 40px; display: flex; justify-content: space-between; padding: 5px 2px 2px 2px ">
		<div id="<!--__PANELNAME__-->-buttonbar-left">
			<a id="<!--__PANELNAME__-->-btn_prev" class="easyui-linkbutton c8 fgta-button-detilprev" style="width: 50px">Prev</a>
			<a id="<!--__PANELNAME__-->-btn_next" class="easyui-linkbutton c8 fgta-button-detilnext" style="width: 50px">Next</a>
		</div>

		<div id="<!--__PANELNAME__-->-buttonbar-middle">
			<a id="<!--__PANELNAME__-->-btn_addnew" class="easyui-linkbutton c8 fgta-button-detiladd" style="width: 100px">Tambah Baru</a>
		</div>

		<div id="<!--__PANELNAME__-->-buttonbar-right">
			<a id="<!--__PANELNAME__-->-btn_delete" class="easyui-linkbutton c5" style="width: 100px">Hapus</a>
		</div>
	</div>
	<?php } ?>




</div>	
