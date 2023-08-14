<div id="pnl_list">
	<div class="fgta-page-title">Daftar <!--__PAGETITLE__--></div>

	<div id="pnl_list-pnl_head" style="display: flex; align-items: flex-end">
		<?php
		$customheadbutton = __DIR__.'/<!--__CUSTOMHEADBUTTONINC__-->'; 
		if (is_file($customheadbutton)) {
			include $customheadbutton;
		} else { ?>
		<div class="list-buttonbaru" style="text-align: right; width: calc(100% - 10px); float: right;  position: absolute">
			<a href="javascript:void(0)" id="pnl_list-btn_new" class="easyui-linkbutton c8" style="width: 60px">Baru</a>
		</div>
		<?php } ?>

		<?php
		$customsearch = __DIR__.'/<!--__CUSTOMSEARCHINC__-->'; 
		if (is_file($customsearch)) {
			include $customsearch;
		} else { ?>
		<!-- Simple Query -->
		<div class="list-search-wrap" style="width: calc(100% - 65px); display: flex;">
			<div class="list-search-item" style="width: 50px;">Cari</div>
			<div class="list-search-item">
				<input id="pnl_list-txt_search" class="easyui-textbox" style="width: 100%">
			</div>
			<div class="list-search-item" style="width: 45px">
				<a href="javascript:void(0)" id="pnl_list-btn_load" class="easyui-linkbutton c8" style="width: 45px">Load</a>
			</div>
		</div>
		<?php } ?>
	</div>


	<div style="margin-top: 10px">
		<table id="pnl_list-tbl_list" paging="true" cellspacing="0" width="100%" class="deftable">
			<?php
			$customview = __DIR__.'/<!--__CUSTOMVIEWINC__-->'; 
			if (is_file($customview)) {
				include $customview;
			} else { ?>

			<thead>
				<tr>
<!--__HEADERMAP__-->
				</tr>
				<tr style="background-color: #cccccc; height: 30px">
<!--__HEADERROW__-->
				</tr>
			</thead>

			<?php } ?>

		</table>
	</div>


	<?php
	$customfootbutton = __DIR__.'/<!--__CUSTOMFOOTBUTTONINC__-->'; 
	if (is_file($customfootbutton)) {
		include $customfootbutton;
	} 
	?>	

	<?php
	$custompagefooter = __DIR__.'/<!--__CUSTOMPAGEFOOTERINC__-->'; 
	if (is_file($custompagefooter)) {
		include $custompagefooter;
	} 
	?>	

</div>