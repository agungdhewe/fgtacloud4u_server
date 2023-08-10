<div id="obj_framecontainer" class="page-frame-container">
</div>

<div id="obj_pageheader" class="hidden-element">
	<div class="page-descr">xxxx</div>
	<div class="page-paging">page x of y</div>
</div>


<div id="wrapper" class="report-wrapper">
	<div id="obj_report_header" class="report-header fullwidth">

		<div style="display: flex; justify-content: space-between; margin-bottom: 1mm">
			<div style="font-weight: bold; font-size: 1.3em"><?=__COMPANY_NAME__?></div>
			<div>
				<div style="font-style: italic; font-size: 0.7em; color: #999; text-align: right">form/kalista/frm/001</div>
				<div style="font-weight: bold; font-size: 1.3em; text-align: right">Form Name</div>
			</div>
		</div>

		<div class="head-tbl-cnt">
			<div class="head-tbl-docdata">
				<div class="head-fld-cnt" style="width: 9cm">
					<div class="head-fld-label">ID</div>
					<div class="head-fld-value">xxxxx</div>
				</div>
				<div class="head-fld-cnt" style="width: 8.5cm">
					<div class="head-fld-label">Date</div>
					<div class="head-fld-value">xxxxx</div>
				</div>
				<div class="head-fld-cnt" style="width: 17.5cm">
					<div class="head-fld-label">Descr</div>
					<div class="head-fld-value">ini desckripsi satu dua tiga</div>
				</div>
			</div>

			<div style="width: 15mm">
				<div style="width:15mm; text-align: right">
					<canvas id="elqrcode"></canvas>
				</div>
				<div id="obj_paging_page_1" class="page-paging" style="text-align: center">page x of y</div>
			</div>
		</div>

	</div>


	<table id="obj_reporttable" class="report-table fullwidth" cellpadding="0" cellspacing="0"> 
		<thead id="obj_reporttable_header" class="report-page-header">
			<th class="cell-header col-no" data-fill-color='CCCCCC'>No</th>
			<th class="cell-header col-descr" data-fill-color='CCCCCC'>Descr</th>
		</thead>

		<tfoot id="obj_reporttable_footer" class="report-page-footer">
			<tr id="obj_reporttable_loadinginfo">
				<td>
					<div id="obj_reporttable_loadingmessage" class="footerstatusbox" style="position: absolute; padding-top: 10px; font-weight: bold">Wait, report are still loading ...</div>
				</td>
			</tr>
		</tfoot>

		<tbody id="obj_reporttable_body">
		</tbody>


	</table>


	<div id="obj_report_footer" class="fullwidth report-footer report-footer-initial">
		<div class="report-footer-content">
			footer<br>
			footer<br>
			footer<br>
			footer<br>
		</div>
	</div>


</div>