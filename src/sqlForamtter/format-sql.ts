import { format } from 'sql-formatter-plus-plus/dist/sql-formatter.min.js'

export default function formatSql(sql?: string): string {
  // return mySqlFormatter.format(sql || '')
  let formatedSQL = sql || ''
    formatedSQL = format(sql || '')
  // try {
  //   formatedSQL = format(sql || '')
  // } catch (err) {
  //   console.log(err)
  //   console.log(sql)
  // }
  return formatedSQL
}

//---------------------------------

// import TiDBSQLFormatter from './TiDBSQLFormatter'

// const mySqlFormatter = new TiDBSQLFormatter({ uppercase: true })

// export default function formatSql(sql?: string): string {
//   // return mySqlFormatter.format(sql || '')
//   let formatedSQL = sql || ''
//   try {
//     formatedSQL = mySqlFormatter.format(sql || '')
//   } catch (err) {
//     console.log(err)
//     console.log(sql)
//   }
//   return formatedSQL
// }

//---------------------------------

// import { format } from 'sql-formatter'

// export default function formatSql(sql?: string): string {
//   let formatedSQL = sql || ''
//   formatedSQL = format(sql || '', { uppercase: true, language: 'mysql' })
//   // try {
//   //   formatedSQL = format(sql || '', { uppercase: true, language: 'mysql' })
//   // } catch (err) {
//   //   console.log(err)
//   //   console.log(sql)
//   // }
//   return formatedSQL
// }

function test() {
  const sqls = [
    // 'select distinct `floor` ( `unix_timestamp` ( `summary_begin_time` ) ) as `begin_time` , `floor` ( `unix_timestamp` ( `summary_end_time` ) ) as `end_time` from `information_schema` . `cluster_statements_summary_history` order by `begin_time` desc , `end_time` desc',

    // 'select `topics` . `id` from `topics` left outer join `categories` on `categories` . `id` = `topics` . `category_id` where ( `topics` . `archetype` <> ? ) and ( coalesce ( `categories` . `topic_id` , ? ) <> `topics` . `id` ) and `topics` . `visible` = true and ( `topics` . `deleted_at` is ? ) and ( `topics` . `category_id` is ? or `topics` . `category_id` in ( ... ) ) and ( `topics` . `category_id` != ? ) and `topics` . `closed` = false and `topics` . `archived` = false and ( `topics` . `created_at` > ? ) order by `rand` ( ) limit ?',

    // 'UPDATE `readernovel_tidb_en`.`useranyone` SET `Today` = \'2022-12-28 15:27:35.604\', `DigTreasureNoPrizeCount` = 1, `DigTreasureDrawCount` = 4, `IntegralExchangeSendName` = NULL, `IntegralExchangeSendPhone` = NULL, `IntegralExchangeSendAddress` = NULL, `DayResetTaskData` = \'{"38":{"Value":5,"HasGet":true,"GetCount":5},"23":{"Value":1,"HasGet":true,"GetCount":0},"15":{"Value":10,"HasGet":true,"GetCount":1},"16":{"Value":30,"HasGet":true,"GetCount":1},"17":{"Value":60,"HasGet":true,"GetCount":1},"22":{"Value":1,"HasGet":false,"GetCount":0}}\',(`NotDayResetTaskData` = \'{"27":{"Value":1,"HasGet":true,"GetCount":0},"34":{"Value":1,"HasGet":true,"GetCount":0},"28":{"Value":1,"HasGet":true,"GetCount":0},"18":{"Value":1,"HasGet":false,"GetCount":0},"45":{"Value":1,"HasGet":true,"GetCount":1}}\', `Id` = 113893844 WHERE `Id` = 113893844 LIMIT 1;',
  ]

  sqls.forEach((s) => console.log(formatSql(s)))
}

test()
