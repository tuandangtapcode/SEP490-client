import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styled from "styled-components";

const TinyWrapper = styled.div`
  position: relative;
  .tox-statusbar__branding {
    display: none;
  }
  .tox .tox-menubar {
    display: ${({ isSimple }) => (isSimple ? "none" : "flex")};
  }
`;

export default function TinyEditor({ setLoading, ...props }) {
  const {
    height = props?.defaultheight || "70vh",
    onWordCount,
    isSimple,
  } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toolbar = isSimple
    ? "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link emoticons fullscreen"
    : "undo redo | bold italic underline strikethrough | fontfamily fontsize | alignleft aligncenter alignright alignjustify lineheight | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak charmap emoticons | fullscreen preview print | insertfile template link anchor codesample | ltr rtl";

  const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <TinyWrapper isFullScreen={isFullScreen} isSimple={isSimple}>
      <Editor
        {...props}
        apiKey="a3h42j0sk3wa9a2hu87x82ttot2xe2zrdyivbxasocuzfv5q"
        init={{
          height: '450px',
          setup: (ed) => {
            ed.on("init", () => {
              setLoading && setLoading(false);
            });
            ed.on("FullscreenStateChanged", (e) => {
              setIsFullScreen(e?.state);
            });
            ed.on("WordCountUpdate", (e) => {
              onWordCount && onWordCount(e?.wordCount);
            });
            ed.on('PastePreProcess', (e) => {
              if (e.content.includes('<img') || e.content.includes('<video')) {
                e.preventDefault();
                alert("Không được phép dán hình ảnh hoặc video.");
              }
            });
          },
          file_picker_types: "file",
          deprecation_warnings: false,
          selector: "textarea#open-source-plugins",
          fontsize_formats: "8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 40px 48px 56px 64px",
          plugins: "fullpage print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen link table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons",
          menubar: "tệp chỉnh_sửa xem chèn định_dạng công_cụ bảng trợ_giúp",
          toolbar: toolbar,
          toolbar_sticky: true,
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_prefix: "{path}{query}-{id}-",
          autosave_restore_when_empty: false,
          autosave_retention: "2m",
          importcss_append: true,
          save_onsavecallback: () => { },
          language: "vi",
          language_url: "https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js",
          paste_data_images: false,
          templates: [
            {
              title: "Bảng mới",
              description: "tạo bảng mới",
              content:
                '<div class="mceTmpl"><table width="98%" border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
            },
            {
              title: "Bắt đầu câu chuyện của tôi",
              description: "Một cách để viết",
              content: "Ngày xửa ngày xưa...",
            },
            {
              title: "Danh sách mới với ngày tháng",
              description: "Danh sách mới với ngày tháng",
              content:
                '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>Danh sách của tôi</h2><ul><li></li><li></li></ul></div>',
            },
          ],
          template_cdate_format: "[Ngày tạo (CDATE): %m/%d/%Y : %H:%M:%S]",
          template_mdate_format: "[Ngày sửa đổi (MDATE): %m/%d/%Y : %H:%M:%S]",
          image_caption: true,
          quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quicktable",
          noneditable_noneditable_class: "mceNonEditable",
          toolbar_mode: "sliding",
          contextmenu: "link table",
          skin: useDarkMode ? "oxide-dark" : "oxide",
          content_css: useDarkMode ? "dark" : "default",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </TinyWrapper>
  );
}

export const RenderTiny = (props) => (
  <TinyEditor
    {...props}
    onEditorChange={props?.onChange}
    placeholder="Nhập nội dung"
  />
);
