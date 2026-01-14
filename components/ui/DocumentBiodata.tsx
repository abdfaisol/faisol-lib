"use client";
import { FC } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import get from "lodash.get";
import { dayDate } from "@/lib/utils/date";
import { getNumber } from "@/lib/utils/getNumber";
import { findLastEducation } from "@/lib/utils/findLastEducation";
Font.register({
  family: "zen",
  src: `${process.env.NEXT_PUBLIC_BASE_URL}/zen.ttf`,
});
Font.register({
  family: "NotoSansCJK",
  fonts: [
    {
      src: `${process.env.NEXT_PUBLIC_BASE_URL}/NotoSansSC-Regular.otf`,
      fontWeight: "normal",
    },
    {
      src: `${process.env.NEXT_PUBLIC_BASE_URL}/NotoSansSC-Bold.otf`,
      fontWeight: "bold",
    },
  ],
});
// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "NotoSansCJK",
    fontSize: 10,
    display: "flex",
    // fontWeight: "bold",
    flexDirection: "column",
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    width: 80,
    fontWeight: "bold",
  },

  thead: {
    fontSize: 12,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    flex: 1,
  },
  image: {
    height: 50, // Atur tinggi gambar
    marginBottom: 5,
    alignSelf: "center",
  },
});
// Create Document Component
export const DocumentBiodata: FC<any> = ({ data, onRender }) => {
  return (
    <PDFViewer className="flex-grow w-full">
      <Document
        onRender={(e: any) => {
          if (typeof onRender === "function") {
            onRender();
          }
        }}
      >
        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingTop: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text>Untuk Posisi 部位 :</Text>
                  <View
                    style={{
                      marginLeft: 5,
                      width: 100,
                      borderBottom: "1px dotted black",
                      borderColor: "black",
                    }}
                  ></View>
                </View>
              </View>
              <View
                style={{
                  fontWeight: "bold",
                }}
              >
                <Text>DATA DIRI 个人资料</Text>
              </View>
              {[
                { label: "Nama Lengkap 姓名", value: data?.name },
                {
                  label: "Tempat & Tanggal Lahir 出生地点，日期",
                  value:
                    data?.birth_place && data?.birth_date
                      ? `${data?.birth_place}, ${dayDate(data?.birth_date)}`
                      : "",
                },
              ].map((row: any, rowIndex) => {
                return <RowPDF row={row} rowIndex={rowIndex} key={rowIndex} />;
              })}
            </View>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <View
                style={{
                  width: 90,
                  height: 120,
                  border: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Photo</Text>
                <Text>No. ........</Text>
              </View>
            </View>
          </View>
          {[
            [
              {
                label: "Jenis Kelamin 性别",
                value:
                  data?.gender === "FEMALE"
                    ? "P 女"
                    : data?.gender === "MALE"
                    ? "L 男"
                    : "L 男 / P 女",
                mode: "noline",
              },
              {
                label: "Suku 民族",
                value: "",
              },
            ],
            [
              {
                label: "Status Perkawinan 婚姻状况",
                value: "TK / K0 / K1 / K2 / K3",
                mode: "noline",
              },
              {
                label: "Tinggi 身高 / Berat Badan 体重",
                value: "____ cm / ____ kg",
              },
            ],
            [
              { label: "No. KTP 身份证号码", value: "" },
              { label: "Agama 宗教", value: data?.religion },
            ],
            [
              { label: "Masa Berlaku KTP 身份证有效期", value: "" },
              { label: "NPWP No. 个人所得税", value: "" },
            ],
            [
              {
                label: "Kepemilikan SIM 驾驶证",
                value: "SIM A No. ___________",
              },
              { label: "SIM B No.", value: "" },
            ],
            [
              { label: "SIM C No.", value: "_____________" },
              { label: "Golongan Darah 血型", value: "____" },
            ],
            {
              label: "No. Jamsostek (KPJ) 社会保险卡号",
              value: "",
              // mode: "placeholder",
            },
            { label: "Alamat Lengkap 地址", value: data?.address },
            { label: "Alamat Lengkap Asal 故乡地址", value: "" },
            { label: "Alamat Email 电子邮件地址", value: data?.user?.email },
          ].map((row: any, rowIndex) => {
            return <RowPDF row={row} rowIndex={rowIndex} key={rowIndex} />;
          })}
        </Page>
        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              DATA KELUARGA 家人资料
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "black",
              borderBottomWidth: 0,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <Text
                style={{
                  width: 150,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                Nama 姓名
              </Text>
              <Text
                style={{
                  width: 50,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                L/P 男/女
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                Hub. Keluarga 亲缘
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                Tgl Lahir 生日
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                Pendidikan 学历
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                No. HP 手机号码
              </Text>
              <Text style={{ width: 100, padding: 5 }}>Pekerjaan 工作</Text>
            </View>

            {[
              { category: "Orang Tua 父母亲", count: 2 },
              { category: "Kakak/Adik 兄妹", count: 6 },
              { category: "Istri/Suami 妻子/丈夫", count: 1 },
              { category: "Anak 孩子", count: 2 },
            ].map((group, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottom: 1,
                    borderColor: "gray",
                  }}
                >
                  <Text
                    style={{
                      width: 150,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  >
                    {group.category}
                  </Text>
                  <Text
                    style={{
                      width: 50,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 100,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 100,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 100,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 100,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{ width: 100, padding: 5, borderColor: "black" }}
                  ></Text>
                </View>
                {[...Array(group.count)].map((_, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      borderBottom: 1,
                      borderColor: idx + 1 === group.count ? "black" : "gray",
                    }}
                  >
                    <Text
                      style={{
                        width: 150,
                        padding: 5,
                        borderRight: 1,
                        borderColor: "black",
                      }}
                    >
                      {idx + 1}.
                    </Text>
                    <Text
                      style={{
                        width: 50,
                        padding: 5,
                        borderRight: 1,
                        borderColor: "black",
                      }}
                    ></Text>
                    <Text
                      style={{
                        width: 100,
                        padding: 5,
                        borderRight: 1,
                        borderColor: "black",
                      }}
                    ></Text>
                    <Text
                      style={{
                        width: 100,
                        padding: 5,
                        borderRight: 1,
                        borderColor: "black",
                      }}
                    ></Text>
                    <Text
                      style={{
                        width: 100,
                        padding: 5,
                        borderRight: 1,
                        borderColor: "black",
                      }}
                    ></Text>
                    <Text
                      style={{
                        width: 100,
                        padding: 5,
                        borderRight: 1,
                        borderColor: "black",
                      }}
                    ></Text>
                    <Text style={{ width: 100, padding: 5 }}></Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              PENDIDIKAN 学历
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              A. Formal 正式
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderBottomWidth: 0,
              borderColor: "black",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    borderColor: "black",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  Tahun 年
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: 1,
                      width: 81,
                      maxWidth: 81,
                      borderColor: "black",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Masuk 进入
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      maxWidth: 80,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Keluar 退出
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                <Text>Nama Sekolah 校名</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                <Text>Jurusan 科学</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                <Text>Tempat 地点</Text>
              </View>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                Berijazah 具有文凭书 / Tidak 否
              </Text>

              <View
                style={{
                  flexDirection: "column",
                  width: 120,
                  maxWidth: 120,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    borderBottom: 1,
                    borderColor: "black",
                  }}
                >
                  <Text
                    style={{
                      padding: 5,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Bicara 口语
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    K
                  </Text>
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    C
                  </Text>
                  <Text style={{ width: 40, padding: 5, textAlign: "center" }}>
                    B
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "column", width: 120, maxWidth: 120 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    borderBottom: 1,
                    borderColor: "black",
                  }}
                >
                  <Text
                    style={{
                      padding: 5,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Tulis 写作
                  </Text>
                </View>
                <View style={{ flexDirection: "row", flexGrow: 1 }}>
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    K
                  </Text>
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    C
                  </Text>
                  <Text style={{ width: 40, padding: 5, textAlign: "center" }}>
                    B
                  </Text>
                </View>
              </View>
            </View>

            {[
              "SD 小学",
              "SLTP 中学",
              "SLTA 高学",
              "D 1/2/3",
              "S1",
              "S2 研究",
              "S3",
            ].map((level, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <Text
                  style={{
                    width: 80,
                    padding: 5,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 5,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                >
                  {findLastEducation(level, data?.educations, "graduate_year")}
                </Text>
                <Text
                  style={{
                    width: 200,
                    padding: 5,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                >
                  {findLastEducation(level, data?.educations, "school_name") ||
                    level}
                </Text>
                <Text
                  style={{
                    width: 120,
                    padding: 5,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                >
                  {findLastEducation(level, data?.educations, "major")}
                </Text>
                <Text
                  style={{
                    width: 100,
                    padding: 5,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 100,
                    padding: 5,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <View
                  style={{ flexDirection: "row", width: 120, maxWidth: 120 }}
                >
                  <Text
                    style={{
                      width: 38,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 38,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                </View>
                <View
                  style={{ flexDirection: "row", width: 120, maxWidth: 120 }}
                >
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text
                    style={{
                      width: 40,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text style={{ width: 40, padding: 5 }}></Text>
                </View>
              </View>
            ))}
          </View>
          <View>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              B. Non Formal非正式
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderBottom: 0,
              borderColor: "black",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <Text
                style={{
                  width: 80,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                Tahun 年
              </Text>
              <Text
                style={{
                  width: 250,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Materi Pelatihan 培训材料
              </Text>
              <Text
                style={{
                  width: 150,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Penyelenggara 主办者
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Lamanya 长度
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Tempat 地点
              </Text>
              <Text
                style={{
                  width: 100,
                  padding: 5,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Dibiayai 融资
              </Text>
              <Text style={{ width: 100, padding: 5, textAlign: "center" }}>
                Berijazah 具有文凭书
              </Text>
            </View>
            {[...Array(6)].map((_, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 250,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 150,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 100,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 100,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 100,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text style={{ width: 100, padding: 8 }}></Text>
              </View>
            ))}
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              AKTIVITAS SOSIAL社交活动
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderBottom: 0,
              borderColor: "black",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    borderColor: "black",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 5,
                  }}
                >
                  Tahun 年
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: 1,
                      width: 80,
                      maxWidth: 80,
                      borderColor: "black",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Masuk 进入</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      maxWidth: 80,
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Keluar 退出</Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  width: 250,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Nama Organisasi 本组织名称
              </Text>
              <Text
                style={{
                  width: 150,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Tempat 地点
              </Text>
              <Text
                style={{
                  width: 150,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Posisi 地位
              </Text>
              <Text style={{ width: 300, padding: 8, textAlign: "center" }}>
                Deskripsi Organisasi 本组织的说明
              </Text>
            </View>

            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <View
                  style={{
                    width: 160,
                    borderRight: 1,
                    borderColor: "black",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: 80,
                      padding: 10,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text style={{ width: 80, padding: 10 }}></Text>
                </View>
                <Text
                  style={{
                    width: 250,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 150,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 150,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text style={{ width: 300, padding: 8 }}></Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              REFERENSI参考
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderBottom: 0,
              borderColor: "black",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <Text
                style={{
                  width: 200,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Nama 姓名
              </Text>
              <Text
                style={{
                  width: 250,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Nama Perusahaan 公司名称
              </Text>
              <Text
                style={{
                  width: 250,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Alamat 地址
              </Text>
              <Text
                style={{
                  width: 150,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                No. Telp. 电话号码
              </Text>
              <Text
                style={{
                  width: 150,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Posisi 地位
              </Text>
              <Text style={{ width: 150, padding: 8, textAlign: "center" }}>
                Hubungan 关系
              </Text>
            </View>

            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <Text
                  style={{
                    width: 200,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 250,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 250,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 150,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 150,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text style={{ width: 150, padding: 10 }}></Text>
              </View>
            ))}
          </View>
        </Page>

        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              PENGALAMAN KERJA工作经验
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Diluar Grup JULONG 于julong集团以外(Dimulai dari perusahaan yang
              terakhir始于最后一家公司起)
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "black",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    borderColor: "black",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 5,
                  }}
                >
                  Tahun 年
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <View
                    style={{
                      width: 80,
                      borderRight: 1,
                      borderColor: "black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Masuk 进入</Text>
                  </View>
                  <View
                    style={{
                      width: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Keluar 退出</Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  width: 300,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Nama & Alamat Perusahaan 公司名称和地址
              </Text>
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center", padding: 5 }}>
                  Jabatan 职级
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 81,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Awal 初
                  </Text>
                  <Text style={{ width: 80, padding: 5, textAlign: "center" }}>
                    Akhir 末
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center", padding: 5 }}>
                  Gaji 薪水
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 81,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Awal 初
                  </Text>
                  <Text style={{ width: 80, padding: 5, textAlign: "center" }}>
                    Akhir 末
                  </Text>
                </View>
              </View>
              <Text style={{ width: 150, padding: 8, textAlign: "center" }}>
                Alasan Keluar 退出理由
              </Text>
            </View>

            {[...Array(2)].map((_, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <View
                  style={{
                    width: 160,
                    borderRight: 1,
                    borderColor: "black",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: 80,
                      padding: 10,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text style={{ width: 80, padding: 10 }}></Text>
                </View>
                <Text
                  style={{
                    width: 300,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text style={{ width: 150, padding: 10 }}></Text>
              </View>
            ))}

            {/* Additional Description Section */}
            <View
              style={{
                flexDirection: "row",
                borderColor: "black",
                height: 200,
              }}
            >
              <View
                style={{
                  width: 317,
                  padding: 10,

                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                <Text>
                  Silahkan tunjukkan posisi anda dalam struktur organisasi
                  perusahaan
                </Text>
                <Text>请您指指出您在公司系统里的职级：</Text>
              </View>
              <View style={{ width: 324, padding: 10 }}>
                <Text>Jelaskan tanggung jawab pekerjaan saudara</Text>
                <Text>描述您的工作职责：</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              border: 1,
              borderColor: "black",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    borderColor: "black",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 5,
                  }}
                >
                  Tahun 年
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <View
                    style={{
                      width: 80,
                      borderRight: 1,
                      borderColor: "black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Masuk 进入</Text>
                  </View>
                  <View
                    style={{
                      width: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Keluar 退出</Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  width: 300,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Nama & Alamat Perusahaan 公司名称和地址
              </Text>
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center", padding: 5 }}>
                  Jabatan 职级
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 81,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Awal 初
                  </Text>
                  <Text style={{ width: 80, padding: 5, textAlign: "center" }}>
                    Akhir 末
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center", padding: 5 }}>
                  Gaji 薪水
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 81,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Awal 初
                  </Text>
                  <Text style={{ width: 80, padding: 5, textAlign: "center" }}>
                    Akhir 末
                  </Text>
                </View>
              </View>
              <Text style={{ width: 150, padding: 8, textAlign: "center" }}>
                Alasan Keluar 退出理由
              </Text>
            </View>

            {[...Array(2)].map((_, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <View
                  style={{
                    width: 160,
                    borderRight: 1,
                    borderColor: "black",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: 80,
                      padding: 10,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text style={{ width: 80, padding: 10 }}></Text>
                </View>
                <Text
                  style={{
                    width: 300,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 10,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text style={{ width: 150, padding: 10 }}></Text>
              </View>
            ))}

            {/* Additional Description Section */}
            <View
              style={{
                flexDirection: "row",
                borderColor: "black",
                height: 200,
              }}
            >
              <View
                style={{
                  width: 317,
                  padding: 10,

                  borderRight: 1,
                  borderColor: "black",
                }}
              >
                <Text>
                  Silahkan tunjukkan posisi anda dalam struktur organisasi
                  perusahaan
                </Text>
                <Text>请您指指出您在公司系统里的职级：</Text>
              </View>
              <View style={{ width: 324, padding: 10 }}>
                <Text>Jelaskan tanggung jawab pekerjaan saudara</Text>
                <Text>描述您的工作职责：</Text>
              </View>
            </View>
          </View>
        </Page>

        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Dalam Grup JULONG于julong集团内(Dimulai dari perusahaan yang
              terakhir始于最后一家公司起)
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "black",
              borderBottomWidth: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    borderColor: "black",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 5,
                  }}
                >
                  Tahun 年
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <View
                    style={{
                      width: 80,
                      borderRight: 1,
                      borderColor: "black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Masuk 进入</Text>
                  </View>
                  <View
                    style={{
                      width: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Keluar 退出</Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  width: 300,
                  padding: 8,
                  borderRight: 1,
                  borderColor: "black",
                  textAlign: "center",
                }}
              >
                Nama & Alamat Perusahaan 公司名称和地址
              </Text>
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center", padding: 5 }}>
                  Jabatan 职级
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 81,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Awal 初
                  </Text>
                  <Text style={{ width: 80, padding: 5, textAlign: "center" }}>
                    Akhir 末
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: 160,
                  borderRight: 1,
                  borderColor: "black",
                  flexDirection: "column",
                }}
              >
                <Text style={{ textAlign: "center", padding: 5 }}>
                  Gaji 薪水
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderTop: 1,
                    borderColor: "black",
                    flexGrow: 1,
                  }}
                >
                  <Text
                    style={{
                      width: 81,
                      padding: 5,
                      borderRight: 1,
                      borderColor: "black",
                      textAlign: "center",
                    }}
                  >
                    Awal 初
                  </Text>
                  <Text style={{ width: 80, padding: 5, textAlign: "center" }}>
                    Akhir 末
                  </Text>
                </View>
              </View>
              <Text style={{ width: 150, padding: 8, textAlign: "center" }}>
                Alasan Pindah 搬迁理由
              </Text>
            </View>

            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: 1,
                  borderColor: "black",
                }}
              >
                <View
                  style={{
                    width: 160,
                    borderRight: 1,
                    borderColor: "black",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: 80,
                      padding: 20,
                      borderRight: 1,
                      borderColor: "black",
                    }}
                  ></Text>
                  <Text style={{ width: 80, padding: 10 }}></Text>
                </View>
                <Text
                  style={{
                    width: 300,
                    padding: 20,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 20,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 20,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 20,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text
                  style={{
                    width: 80,
                    padding: 20,
                    borderRight: 1,
                    borderColor: "black",
                  }}
                ></Text>
                <Text style={{ width: 150, padding: 10 }}></Text>
              </View>
            ))}
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              INFORMASI LAINNYA更多信息
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>
              1. Siapa yang dapat dihubungi jika terjadi keadaan darurat?
              在紧急情况下可以与谁进行联系？
            </Text>
            {[
              [
                {
                  label: "Nama 姓名",
                  value: "L 男 / P 女",
                },
                {
                  label: "Hubungan 关系",
                  value: "",
                },
              ],
              [
                {
                  label: "Alamat Lengkap 地址",
                  value: "",
                },
                {
                  label: "No. Telp. / HP 电话号码",
                  value: "",
                },
              ],
            ].map((row: any, rowIndex) => {
              return <RowPDF row={row} rowIndex={rowIndex} key={rowIndex} />;
            })}
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>
              2. Dapatkah kami menghubungi referensi anda, untuk memperoleh
              informasi secara lengkap mengenai diri anda?
            </Text>
            <View style={{ flexDirection: "row", display: "flex" }}>
              <Text>我们能否与您的参考接触, 为获得您自己已完成的信息?</Text>
              <View
                style={{
                  marginLeft: 5,
                  flexGrow: 1,
                  borderBottom: "1px dotted black",
                  borderColor: "black",
                }}
              >
                <Text
                  style={{
                    color: "transparent",
                  }}
                >
                  :
                </Text>
              </View>
            </View>
          </View>
          {[...Array(12)].map((_, index) => {
            const questions = [
              "Pernahkah anda bekerja pada perusahaan/grup kami sebelumnya? 您是否在过去曾经与我们公司集团职业? Ya是 / Tidak否 *",
              "Adakah keluarga/kenalan anda yang bekerja pada perusahaan/grup kami? 您有没有亲戚朋友在我们公司职业? Ya是 / Tidak否 *",
              "Pernahkah anda menderita sakit berat atau kecelakaan? 您是否曾经得重病或严重事故? Ya是 / Tidak否 *",
              "Pernahkah anda bermasalah dengan pihak yang berwajib? 您是否与有关当局惹麻烦? Ya是 / Tidak否 *",
              "Apa hobi anda? 您的业余爱好是什么?",
              "Apakah anda mempunyai masalah dengan tubuh anda, seperti penglihatan, pendengaran, berbicara, buta warna dll? 您本身的腑器 (听觉, 视觉, 讲话等等) 是否有问题 Ya是 / Tidak否 *",
              "Kenapa anda ingin bergabung dengan perusahaan kami? 您为何想加入我们公司?",
              "Bersediakah anda jika dimutasikan ke cabang lain atau perusahaan lain yang masih berada dalam grup perusahaan kami? 您是否愿意重新指派到另一家与我们有关的家公司? Ya是 / Tidak否 *",
              "Bersediakah anda perjalanan dinas ke luar kota untuk waktu tertentu? 您愿意不到别处官方? Ya是 / Tidak否 *",
              "Tunjangan dan fasilitas apa saja yang anda peroleh dari perusahaan tempat anda bekerja sekarang/sebelumnya?",
              "Berapa gaji dan fasilitas yang anda harapkan? 你希望得到的薪水和设施是什么?",
              "Jika anda diterima, kapan anda akan bergabung dengan perusahaan kami?",
            ];

            const details = [
              "Jika ya, kapan, sebagai apa dan nama perusahaan ? 若是是, 在何时, 什么职位, 和公司名称?",
              "Jika ya, siapa, sebagai apa dan diperusahaan mana ? 若是是, 谁, 什么职位, 和公司名称?",
              "Jika ya, kapan dan apa penyebabnya/kecelakaannya ? 若是是, 何时, 和什么疾病/事故?",
              "Jika ya, kapan dan kasus apa ? 若是是, 何时, 什么案件?",
              "",
              "Jika ya, sebutkan apa ? 若是是, 请您提出来。",
              "",
              "Jika tidak, kenapa ? 若不愿, 为什么?",
              "Jika tidak, kenapa ? 若不愿, 为什么?",
              "您目前/以前的职业公司提供什么津贴和设备。",
              "",
              "若您被录用的话, 在何时可以加入我们公司?",
            ];

            const hasDetail = details[index] !== "";

            return (
              <View
                key={index}
                style={
                  !hasDetail
                    ? {
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                      }
                    : { marginBottom: 10 }
                }
              >
                <Text>
                  {index + 3}. {questions[index]}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    ...(!hasDetail && {
                      flexGrow: 1,
                    }),
                  }}
                >
                  {hasDetail ? <Text>{details[index]}</Text> : <></>}
                  <View
                    style={{
                      marginLeft: 5,
                      flexGrow: 1,
                      borderBottom: "1px dotted black",
                      borderColor: "black",
                    }}
                  >
                    <Text style={{ color: "transparent" }}>:</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Page>

        <Page size="A4" style={styles.page}>
          <HeaderPDF data={data} />
          <View>
            <Text>
              Keterangan di atas saya buat dengan sebenarnya dan jika dikemudian
              hari ternyata terdapat hal-hal yang bertentangan, maka saya
              bersedia dituntut
            </Text>
            <Text>
              信息效果已与我方的说明一致。同样送类标题由我方的术强制转换地解释。若有朝一日存在任何虚假信息，
            </Text>
            <Text>我能够接受贵公司的制裁并愿意收！</Text>
          </View>
          <View
            style={{
              marginTop: 50,
              alignItems: "flex-end", // Menempatkan elemen ke sisi kanan
              paddingRight: 50, // Memberikan jarak dari tepi kanan halaman
            }}
          >
            {/* Bagian Kota dan Tanggal */}
            <View
              style={{
                width: 180,
                borderBottom: "1px dotted black",
                marginBottom: 20, // Jarak antara kota/tanggal dengan tanda tangan
              }}
            >
              <Text
                style={{
                  paddingLeft: 80,
                }}
              >
                ,
              </Text>
            </View>

            {/* Bagian Tanda Tangan */}
            <View
              style={{
                width: 180,
                height: 50, // Memberikan ruang untuk tanda tangan
                borderBottom: 1,
                borderColor: "black",
                textAlign: "center",
                justifyContent: "flex-end", // Memastikan teks tetap di bawah garis
                display: "flex",
              }}
            >
              <Text style={{ color: "transparent" }}>.</Text>
            </View>
            <Text style={{ marginTop: 5 }}>Calon Karyawan 候选人</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
const HeaderPDF = ({ data }: { data: any }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "black",
      }}
      fixed
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 100,
            borderRight: 1,
            borderColor: "black",
          }}
        >
          <Image
            style={{ ...styles.image, marginRight: 10, marginLeft: 10 }}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/julong.png`}
          />
          <View>
            <Text style={styles.title}>JULONG GROUP INDONESIA</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            flexGrow: 1,
            height: "100%",
            borderRight: 1,
            borderColor: "black",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>FORMULIR 表单</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,
                borderColor: "black",
                borderRight: 1,
                borderBottom: 1,
              }}
            >
              <Text>Nomor Dokumen</Text>
              <Text> 文件编码</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                borderColor: "black",
                borderBottom: 1,
                width: 130,
              }}
            >
              <Text>{get(data, "document_number") || "-"}</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,
                borderColor: "black",
                borderRight: 1,
                borderBottom: 1,
              }}
            >
              <Text>Revisi 修正</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,
                borderColor: "black",
                borderBottom: 1,
              }}
            >
              <Text>{getNumber(get(data, "revised"))}</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,
                borderColor: "black",
                borderRight: 1,
                borderBottom: 1,
              }}
            >
              <Text>Tanggal Berlaku 有效期</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,
                borderColor: "black",
                borderBottom: 1,
              }}
            >
              <Text>{dayDate(get(data, "document_date"))}</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,
                borderColor: "black",
                borderRight: 1,
              }}
            >
              <Text>Halaman 页面</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 5,
                width: 130,

                borderColor: "black",
              }}
            >
              <Text
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} dari ${totalPages}`
                }
              />
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderTop: 1,
          borderColor: "black",
          fontWeight: "bold",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Text>DATA PRIBADI KARYAWAN 员工个人资料</Text>
        </View>
      </View>
    </View>
  );
};
const RowPDF = ({ row, rowIndex }: { row: any; rowIndex: any }) => {
  if (!Array.isArray(row)) {
    return (
      <View
        key={rowIndex}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          paddingRight: 5,
          marginTop: 5,
        }}
      >
        <View
          style={{
            width: 120,
            maxWidth: 120,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Text>{row.label}</Text>
        </View>
        <Text>:</Text>
        <View
          style={{
            marginLeft: 5,
            flexGrow: 1,
            borderBottom: "1px dotted black",
            borderColor: "black",
            ...(row?.mode === "placeholder" && {
              justifyContent: "flex-end",
              display: "flex",
              flexDirection: "row",
            }),
          }}
        >
          <Text
            style={{
              ...(row?.mode === "placeholder" && {
                fontSize: 8,
                // fontStyle: "italic",
                // textDecoration: "italic",
              }),
            }}
          >
            {row.value || " "}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View
      key={rowIndex}
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: 5,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
        }}
      >
        {row.map((item, colIndex) => (
          <View
            key={colIndex}
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                paddingRight: 5,
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  width: 120,
                  maxWidth: 120,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Text>{item.label}</Text>
              </View>
              <Text>:</Text>
              <View
                style={
                  item?.mode === "noline"
                    ? {
                        marginLeft: 5,
                        flexGrow: 1,
                      }
                    : {
                        marginLeft: 5,
                        flexGrow: 1,
                        borderBottom: "1px dotted black",
                        borderColor: "black",
                      }
                }
              >
                <Text
                  style={
                    item?.mode === "noline" ? {} : { color: "transparent" }
                  }
                >
                  {item.value || ":"}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
